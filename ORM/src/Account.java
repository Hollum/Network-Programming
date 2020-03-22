import java.util.*;

import java.io.*;

public class Account implements Serializable {
    //@Id //@GeneratedValue(strategy = GenerationType.AUTO)
    private String owner;
    private double accountNumber;
    private double balance;
/*
   import javax.persistence.*;
   @Entity @NamedQuery(name="finnAntallBoker", query="SELECT COUNT(o) from Bok o")

 */

    public Account(){}
    public Account(String owner, double accountNumber){
        this.owner = owner;
        this.accountNumber = accountNumber;
        this.balance = 0;
    }

    public void withdraw(double money){
         double newBalance = this.balance - money;
         this.balance = newBalance;
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

    public void setAccountNumber(double accountNumber) {
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
