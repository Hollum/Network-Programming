import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class ServerUDP {
    public static void main(String[] args) throws Exception{
        DatagramSocket ds = new DatagramSocket(9999);


        byte[] b1 = new byte[1024];

        while (true){

            DatagramPacket dp = new DatagramPacket(b1, b1.length);
            ds.receive(dp);

            String str = new String(dp.getData());
            System.out.println(str);

            String[] input = str.split(" ");
            byte[] b2;
            if(input.length == 3){
                int result = 0;
                try {

                    String operation = input[1];
                    int number1 = Integer.parseInt(input[0].trim());
                    int number2 = Integer.parseInt(input[2].trim());



                    switch (operation) {
                        case "+":
                            result = number1 + number2;
                            break;
                        case "-":
                            result = number1 - number2;
                            break;
                        case "*" :
                            result = number1 * number2;
                            break;
                        case "/":
                            result = number1 / number2;
                            break;
                    }

                } catch (Exception e){
                    e.printStackTrace();
                }
                b2 = (result + "").getBytes();
            } else {
                b2 = ("Invalid value, check syntax").getBytes();
            }
            InetAddress ia = InetAddress.getLocalHost();
            DatagramPacket dp1 = new DatagramPacket(b2, b2.length, ia, dp.getPort());
            ds.send(dp1);
        }

    }
}
