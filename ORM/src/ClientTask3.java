import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.List;

public class ClientTask3 {
    public static void main(String[] args){
        EntityManagerFactory emf = null;
        AccountDAO facade = null;

        try{
            emf = Persistence.createEntityManagerFactory(("account"));
            facade = new AccountDAO(emf);

            List<Account> list = facade.getAccountsByBalance(200);
            for(Account a : list){
                System.out.println("---- " + a );
            }

            //--------------Before--------------
            //list.get(0):    Jorgen's account balance = 700
            //list.get(1):    Sofie's account balance = 500
            list.get(0).withdraw(100);

            Thread.sleep(5000);

            list.get(1).reciveMoney(100);
            //--------------After--------------
            //list.get(0):    Jorgen's account balance = 600
            //list.get(1):    Sofie's account balance = 600

            /*
            Running the client in paralelle. First process with a thread sleep and second without.
            Should be:
            //list.get(0):    Jorgen's account balance = 500 (runs 2x times 100 x2 = 200 --> 700-200 = 500)
            //list.get(1):    Sofie's account balance = 700 (runs 2x times 100 x2 = 200 --> 500+200 = 700)

            Output:
            //list.get(0):    Jorgen's account balance = 600
            //list.get(1):    Sofie's account balance = 600

            We can therefor conclude that there is a lock problem
             */

            facade.changeAccount(list.get(0));
            facade.changeAccount(list.get(1));


            List<Account> list2 = facade.getAllAccounts();
            for(Account a : list2){
                System.out.println("---- " + a );
            }

        } catch (Exception e){
            System.out.println(e);

        } finally {
            System.out.println("\nclosing down");
            emf.close();


        }
    }

}
