/*
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
    explicit Workers(int threads){
        this -> numberOfThreads = threads;
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

    void setInfiniteLoop(bool val){
        infiniteLoop = val;
    }

    //Boolean for checking if client wants to stop program
    bool stopCalled = false;

    //Client method for stopping process
    void stopProgram(){
        stopCalled = true;
    }

    //If last task and stop method called -> stop loop
    void stopLoop(){
        if (tasks.size() == 1 && stopCalled){
            setInfiniteLoop(false);
        }
    }

    // Solves the tasks from the list 'task':
    void start(){
        vector<thread> worker_threads;
        for (int i = 0; i < numberOfThreads; i++) {
            worker_threads.emplace_back([this, i]{
                while (infiniteLoop) {
                    function<void()> task;
                    {
                        unique_lock<mutex> lock(mtx);
                        stopLoop();
                        cout << "Tråd: " << this_thread::get_id() << " i: " << i << endl;

                        while(tasks.empty())
                            cv.wait(lock);

                        task = *tasks.begin();
                        tasks.pop_front();
                    }
                    //Executes task after lock is released
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
    list<thread> threads;


    //Initializes worker threads and event loop
    Workers worker_threads(4);
    Workers event_loop(1);

    //Thread for running worker tasks
    threads.emplace_back([&worker_threads]
                         {
                             worker_threads.start();
                         });

    //Thread for running event loop tasks
    threads.emplace_back([&event_loop]
                         {
                             event_loop.start();
                         });

    //Posts worker threads tasks
    threads.emplace_back([&worker_threads]
                         {
                             worker_threads.post([]{

                                 cout << "Jeg" << endl;
                             });

                             worker_threads.post([]{

                                 cout << "er" << endl;
                             });

                             worker_threads.post([]{

                                 cout << "en" << endl;
                             });

                             worker_threads.post([]{

                                 cout << "worker_thread" << endl;
                             });


                         });
    worker_threads.stopProgram();

    //Posts event loop tasks
    threads.emplace_back([&event_loop]
                         {
                             event_loop.post([] {
                                 cout << "jeg" << endl;
                             });

                             event_loop.post([] {
                                 cout << "er" << endl;
                             });

                             event_loop.post([] {
                                 cout << "en" << endl;
                             });

                             event_loop.post([] {
                                 cout << "event_loop" << endl;
                             });

                             event_loop.post_timeout([] {
                                 cout << "event_loop - TIMEOUT" << endl;
                             });
                         });

    //Stops worker threads and event loop

    event_loop.stopProgram();

    for(auto &thread : threads)
        thread.join();
}
 */