package SocketSingle;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class SocketClient {
    public static void main(String[] args) throws IOException {
        final int PORT = 1250;

        //Scanner to read terminal
        Scanner readTerminal = new Scanner(System.in);
        System.out.println("Write user to be run upon");
        String server = readTerminal.nextLine();

        //Setup connection to server
        Socket connection = new Socket(server, PORT);
        System.out.println("Connected");

        //Open connection with server
        InputStreamReader connectionReader = new InputStreamReader(connection.getInputStream());
        BufferedReader reader = new BufferedReader(connectionReader);
        PrintWriter writer = new PrintWriter(connection.getOutputStream(), true);


        //Read intro and write to client
        String intro1 = reader.readLine();
        String intro2 = reader.readLine();
        String intro3 = reader.readLine();
        String intro4 = reader.readLine();
        String intro5 = reader.readLine();
        System.out.println(intro1 + "\n" + intro2 + "\n" + intro3 + "\n" + intro4  + "\n" + intro5);

        //Read text from terminal (user)
        String oneLine = readTerminal.nextLine();
        while(!oneLine.equals("")){
            writer.println(oneLine);
            String response = reader.readLine();
            System.out.println(response);
            oneLine = readTerminal.nextLine();
        }

        //Close connection
        reader.close();
        writer.close();
        connection.close();



    }
}
