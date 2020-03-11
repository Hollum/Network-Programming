package SocketThread;

import java.io.IOException;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;

public class Server {
    public static void main(String[] args) throws IOException {
        final int PORT = 1250;

        ServerSocket ss = new ServerSocket(PORT);
        System.out.println("Waiting for response on port " + PORT + "...");
        System.out.println(InetAddress.getLocalHost());

        ArrayList<ConnectionHandler> connections = new ArrayList<>();
        Socket connection = null;

        while (true) {
            connection = ss.accept();
            ConnectionHandler t = new ConnectionHandler(connection);
            t.start();
            connections.add(t); // Don't really need this, but have connections in reference if needed later on.
        }
    }
}
