#include <mutex>
#include <iostream>
#include <vector>
#include <thread>
#include <functional>
#include <list>
#include <condition_variable>
#include <atomic>


using namespace std;

class Workers{

private:
    mutex mtx;
    list <function<void()>>tasks;
    int numberOfThreads;
    condition_variable cv;

    atomic<bool> check;
    bool infiniteLoop;


public:

    //Constructor
    Workers(int threads){
        numberOfThreads = threads;
        check = true;
        infiniteLoop = true;
    };


    // Fills up the list 'tasks' with executable tasks
    void post(function<void()> task){
        lock_guard<mutex> lock(mtx);
        tasks.emplace_back(task);
        check = false;
        cv.notify_one();
    }


    //Boolean for checking if client wants to stop program
    bool stopCalled = false;

    //Client method for stopping process
    void stopProgram(){
        stopCalled = true;
    }

    //If last task and stop methode called -> stop loop
    void stopLoop(){
        if (tasks.size() == 1 && stopCalled){
            infiniteLoop = false;
        }
    }

    // Solves the tasks from the list 'task':
    void start(){
        vector<thread> worker_threads;
        for (int i = 0; i < numberOfThreads; i++) {
            worker_threads.emplace_back([this, i ]{
                while (infiniteLoop) {
                    function<void()> task;
                    {
                        unique_lock<mutex> lock(mtx);
                        cout << "Tråd: " << this_thread::get_id() << " i: " << i << endl;
                        while(tasks.empty()) cv.wait(lock);
                            task = *tasks.begin(); //Moves task upfront in the list 'tasks'
                            tasks.pop_front();     //Removes task form tasks.
                            stopLoop();
                    }
                    // Execute task
                        task();
                }
            });
        }
        for (auto &thread : worker_threads)
            thread.join();
    };

    void post_timeout(function<void()> task){
        this_thread::sleep_for(4s);
        task();
    }


};

int main() {

    Workers workers_thread(4);

    //Thread running post commands
    thread t1([&workers_thread] {
        workers_thread.post([]{

            cout << "Jeg" << endl;
        });

        workers_thread.post([]{

            cout << "er" << endl;
        });

        workers_thread.post([]{

            cout << "en" << endl;
        });

        workers_thread.post([]{

            cout << "worker_thread" << endl;
        });


    });

    thread t2([&workers_thread] {
        workers_thread.start();
    });

    thread t3([&workers_thread] {
        workers_thread.post_timeout([]{

            cout << "t3 Venter" << endl;
        });
    });


    workers_thread.stopProgram();
    t1.join();
    t2.join();
    t3.join();



    cout << "----------------" << endl;

    //Event_loop = one thread running
}