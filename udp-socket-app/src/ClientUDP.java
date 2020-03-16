
import java.io.*;
import java.net.*;
public class ClientUDP {
    public static void main(String[] args) throws Exception{

        BufferedReader inFromUser = new BufferedReader(new InputStreamReader(System.in));
        DatagramSocket ds = new DatagramSocket();
        InetAddress ia = InetAddress.getLocalHost();

        System.out.println("Welcome to the UDP calculator!");
        System.out.println("Write '" + "exit" + "' to quit");
        System.out.println("Input: '" + "NUMBER" + "' '" + "OPERATOR" + "' '" + "NUMBER" + "'");

        String oneLine = inFromUser.readLine().trim();
        String i;
        while (!oneLine.equals("exit")){
            i = oneLine;
            byte[] b = (i).getBytes();
            DatagramPacket dp = new DatagramPacket(b, b.length, ia,9999);
            //Send dp to socket
            ds.send(dp);

            byte[] b1 = new byte[1024];
            DatagramPacket dp1 = new DatagramPacket(b1, b1.length);
            ds.receive(dp1);

            String str = new String(dp1.getData());
            System.out.println(str);
            oneLine = inFromUser.readLine().trim();
        }
    }
}
