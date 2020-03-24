import java.util.*;
import javax.persistence.*;
import java.io.*;

@Entity
public class Account implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String owner;
    private int accountNumber;
    private double balance;

    @Version
    private int version;


    public Account(){}
    public Account(String owner, int accountNumber){
        this.owner = owner;
        this.accountNumber = accountNumber;
        this.balance = 0;
    }

    public void withdraw(double money){
        this.balance = this.balance - money;
    }

    public void reciveMoney(double money){
        this.balance = this.balance + money;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public double getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(int accountNumber) {
        this.accountNumber = accountNumber;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    @Override
    public String toString() {
        return "Account{" +
                "owner='" + owner + '\'' +
                ", accountNumber=" + accountNumber +
                ", balance=" + balance +
                '}';
    }
}
