import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class ClientUDP {
    public static void main(String[] args) throws Exception{

        DatagramSocket ds = new DatagramSocket();

        int i = 8;
        //Convert to string to call getBytes
        byte[] b = String.valueOf(i).getBytes();
        InetAddress ia = InetAddress.getLocalHost();


        /*
        Params for sending DatagramPacket
        1. Data to send (byte format)
        2. Data length
        3. IP adress
        4. Port
         */
        DatagramPacket dp = new DatagramPacket(b, b.length, ia,9999);
        //Send dp to socket
        ds.send(dp);


        //Recive
        byte[] b1 = new byte[1024];
        DatagramPacket dp1 = new DatagramPacket(b1, b1.length);
        ds.receive(dp1);

        String str = new String(dp1.getData());
        System.out.println(str);

    }
}
