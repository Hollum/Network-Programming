import javax.persistence.*;
import java.util.List;

public class AccountDAO {
    private EntityManagerFactory emf;

    public AccountDAO(EntityManagerFactory emf){
        this.emf = emf;
    }

    private EntityManager getEM(){
        return emf.createEntityManager();
    }

    private void closeEM(EntityManager em){
        if (em != null && em.isOpen()) em.close();
    }

    public void saveAccount(Account account){
        EntityManager em = getEM();
        try{
            em.getTransaction().begin();
            em.persist(account);//place object in context of saving
            em.getTransaction().commit();//Save
        }finally{
            closeEM(em);
        }
    }

    public List<Account> getAllAccounts(){
        EntityManager em = getEM();
        try{
            Query q = em.createQuery("SELECT OBJECT(o) FROM Account o");
            return q.getResultList();
        }finally{
            closeEM(em);
        }
    }

    public List<Account> getAccountsByBalance(double balance){
        EntityManager em = getEM();
        try{
            Query q = em.createQuery("SELECT OBJECT(o) FROM Account o where o.balance >= " + balance + "");
            return q.getResultList();
        }finally{
            closeEM(em);
        }
    }

    public void changeAccount(Account account){
        EntityManager em = getEM();
        try{
            em.getTransaction().begin();
            Account a = em.merge(account);
            em.getTransaction().commit();
        }finally{
            closeEM(em);
        }
    }


    public static void main(String[] args){
        EntityManagerFactory emf = null;
        AccountDAO facade = null;

        System.out.println("Starting...");

        try {
            emf = Persistence.createEntityManagerFactory("account");
            System.out.println("Konstruktor ferdig " + emf);
            facade = new AccountDAO(emf);
            System.out.println("Konstuktør ferdig");

            //Creates an Account
            Account account = new Account();
            account.setOwner("Jorgen Hollum");
            account.setAccountNumber(123456789);
            account.setBalance(100);
            facade.saveAccount(account);

            account = new Account("Sofie Brittesen", 987654321);
            facade.saveAccount(account);

            //Changing account number to Sofie Brittesen from 987654321 to 66666666
            account.setAccountNumber(66666666);
            facade.changeAccount(account);


            List<Account> list = facade.getAllAccounts();
            for(Account a : list){
                System.out.println("---- " + a );
            }

            //Get all account with balance higher than 20
            List<Account> list2 = facade.getAccountsByBalance(20);
            for(Account a : list2){
                System.out.println("---- " + a );
            }


        } finally {
            if(emf != null)
                emf.close();
        }

    }

}
