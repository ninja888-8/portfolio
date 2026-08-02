/* generates garden.js and garden.wasm using emscripten */

#define _USE_MATH_DEFINES
#include <emscripten/bind.h>
#include <cmath>
#include <random>
#include <string>
#include <vector>
#include <stack>
#include <sstream>

using namespace std;

struct Segment {
    float x1, y1, x2, y2;
    int depth;
};

struct TurtleState {
    float x, y, angle;
    int depth;
};

class Tree {
    private:
        string currentSentence, axiom = "FX";
        float angleStep = 35.0f * (M_PI / 180.0f); // deg to rad
        float initialLength = 25.0f;
        float lengthFactor = 0.8f;
        int growCount = 0;

        random_device rd;
        mt19937 gen;
        uniform_int_distribution<int> distr;

        string expandRule(char ch) {
            if (ch == 'X') {
                int randomNum = distr(gen);

                if (randomNum <= 35) return "F-[[X]+X]+F[+FX]-X";
                else if (randomNum <= 65) return "FF-[-X+X+X]+[+X-X-X]";
                else if (randomNum <= 90) return "F[+X][-X]FX";
                else return "F[-X]X";
            }
            else if (ch == 'F') {
                return "FF";
            }
            return string(1, ch);
        }

    public:
        Tree() :
            gen(rd()),
            distr(1, 100)
        {
            currentSentence = axiom;
        }

        void grow() {
            if (currentSentence.length() > 60000) return; // capped length
            
            string nextSentence = "";
            for (char c: currentSentence) {
                nextSentence += expandRule(c);
            }
            currentSentence = nextSentence;

            growCount++;
            lengthFactor *= 0.7f;
        }

        void reset() {
            currentSentence = axiom;
            growCount = 0;
            lengthFactor = 1.0f;
        }

        vector<Segment> generateSegments(float startX, float startY, float windTime, float windStrength) {
            vector<Segment> segments;
            stack<TurtleState> stateStack;

            TurtleState current = {
                startX, startY, -M_PI_2, 0
            };

            for (int i = 0; i < currentSentence.length(); i++) {
                char c = currentSentence[i];
                if (c == 'F') {
                    float len = initialLength * lengthFactor * pow(0.85f, current.depth);
                    float windAngleOffset = sin(windTime + current.depth * 0.5f) * windStrength * (current.depth * 0.05f);
                    float effectiveAngle = current.angle + windAngleOffset;

                    float nextX = current.x + len * cos(effectiveAngle);
                    float nextY = current.y + len * sin(effectiveAngle);

                    segments.push_back({
                        current.x, current.y, nextX, nextY, current.depth
                    });

                    current.x = nextX;
                    current.y = nextY;
                }
                else if (c == '+') {
                    current.angle += angleStep;
                }
                else if (c == '-') {
                    current.angle -= angleStep;
                }
                else if (c == '[') {
                    stateStack.push(current);
                    current.depth++;
                }
                else if (c == ']') {
                    if (!stateStack.empty()) {
                        current = stateStack.top();
                        stateStack.pop();
                    }
                }
            }

            return segments;
        }
};

EMSCRIPTEN_BINDINGS(bonsai_module) {
    emscripten::value_object<Segment>("Segment")
        .field("x1", &Segment::x1)
        .field("y1", &Segment::y1)
        .field("x2", &Segment::x2)
        .field("y2", &Segment::y2)
        .field("depth", &Segment::depth);

    emscripten::register_vector<Segment>("VectorSegment");

    emscripten::class_<Tree>("BonsaiTree")
        .constructor<>()
        .function("grow", &Tree::grow)
        .function("reset", &Tree::reset)
        .function("generateSegments", &Tree::generateSegments);
}