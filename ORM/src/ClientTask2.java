import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.List;

public class ClientTask2 {
    public static void main(String[] args){
        EntityManagerFactory emf = null;
        AccountDAO facade = null;

        System.out.println("Starting...");

        try {
            emf = Persistence.createEntityManagerFactory("account");
            facade = new AccountDAO(emf);

            //Creates an Account
            Account account1 = new Account("Jorgen Hollum", 121212);
            account1.setBalance(700);
            facade.saveAccount(account1);

            Account account2 = new Account("Sofie Brittesen", 123456);
            account2.setBalance(500);
            facade.saveAccount(account2);

            //Changing account number to Sofie Brittesen from 987654321 to 66666666
            account2.setAccountNumber(666666);
            facade.changeAccount(account2);



            System.out.println(" \n List of all accounts");
            List<Account> list = facade.getAllAccounts();
            for(Account a : list){
                System.out.println("---- " + a );
            }

            System.out.println(" \n List of all accounts with a balance higher than 600");

            //Get all account with balance higher than 600
            List<Account> list2 = facade.getAccountsByBalance(600);
            for(Account a : list2){
                System.out.println("---- " + a );
            }


        } finally {
            if(emf != null)
                emf.close();
        }

    }
}
