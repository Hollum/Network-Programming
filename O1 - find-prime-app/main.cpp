#include <iostream>
#include <thread>
#include <vector>
#include <mutex>

using namespace std;
mutex vectLock;
vector<unsigned int> primeVect;

void checkForPrime(int low, int high) {
    int i, flag;
    if(low == 1){
        low = 2;
    }
    while (low < high) {
        flag = 0;
        for (i = 2; i <= low / 2; ++i) {
            if (low % i == 0) {
                flag = 1;
            }
        }
        if (flag == 0) {
            //cout << low << " ";
            vectLock.lock();
            primeVect.push_back(low);
            vectLock.unlock();
        }
        low++;
    }
}

int main() {
    vector<thread> threads;

    int count, low, high;
    cout << "Enter how many O1 - Find prime number to be run: ";
    cin >> count;

    cout << "Enter interval Start: ";
    cin >> low;
    cout << "Enter interval End: ";
    cin >> high;

    //Find amount of interval numbers
    int differance = high - low;
    //C++ using floor-function, find lowest number - indicates how long for thread to jump in interval
    int divide = differance / count;
    //Get extra numbers to be checked from last thread
    int overhead = high - (divide * count);

    //Keeps track of
    int tempStore = low;
    for (int i = 0; i < count; i++) {
        threads.emplace_back([&tempStore, &divide, &count, i, &high] {
            //cout << "Thread " << i << endl;
            //If last thread to be executed - search for prime in extra numbers, else give thread same search range
            if (i == (count - 1)) {
                checkForPrime(tempStore + (i * divide), high);
                //checkForPrime(tempStore + (i * divide), tempStore + divide * (i + 1) + overhead);
            }
            else {
                checkForPrime(tempStore + (i * divide), tempStore + divide * (i + 1));
            }
        });
        cout << endl;
    }

    //Join all thread
    for (auto &thread : threads)
        thread.join();


    cout << "Prime numbers found: " << endl;
    for(int i = 0; i < primeVect.size(); i++){
        cout << primeVect[i] << " ";
    }
    cout << endl;
}
