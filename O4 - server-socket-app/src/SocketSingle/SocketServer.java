package SocketSingle;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class SocketServer {
    public static void main(String[] args) throws IOException {
        final int PORT = 1250;

        ServerSocket server = new ServerSocket(PORT);
        System.out.println("Waiting for response...");
        System.out.println(InetAddress.getLocalHost());
        Socket connection = server.accept();

        //Open stream for connection with client
        InputStreamReader readerConnection = new InputStreamReader(connection.getInputStream());
        BufferedReader reader = new BufferedReader(readerConnection);
        PrintWriter writer = new PrintWriter(connection.getOutputStream(), true);


        System.out.println("fitte");
        //Send intro to client
        writer.println("Connection successful! \n");
        writer.println("Welcome to the socket calculator!");
        writer.println("1. Add to numbers");
        writer.println("2. subtract to numbers");

        String oneLine = reader.readLine();
        //int option = Integer.parseInt(oneLine);
        int option;
        int number1;
        int number2;
        int sum = 0;
while (oneLine != null) {
    option = Integer.parseInt(oneLine);
    switch (option) {
        case 1:
            writer.println("Number 1;");
            number1 = Integer.parseInt(reader.readLine());
            writer.println("Number 2;");
            number2 = Integer.parseInt(reader.readLine());
            sum = number1 + number2;
            break;
        case 2:
            writer.println("Number 1;");
            number1 = Integer.parseInt(reader.readLine());
            writer.println("Number 2;");
            number2 = Integer.parseInt(reader.readLine());
            sum = number1 - number2;
            break;
    }

    writer.println("Sum: " + sum + " Change calculator by typing 1/2, enter to finish");
    //option = Integer.parseInt(reader.readLine());
    oneLine = reader.readLine();
}
        //Close connection
        reader.close();
        writer.close();
        connection.close();
    }
}
