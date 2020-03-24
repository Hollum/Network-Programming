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

}
