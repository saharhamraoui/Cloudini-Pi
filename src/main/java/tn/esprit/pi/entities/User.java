package tn.esprit.pi.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long idUser ;
   private  String faceDescriptor;
  private String firstName;
  private String lastName;
  private String email;
  private String password;
  private String phoneNumber;


  private String address;
  @Enumerated(EnumType.STRING)
  private Role role;

  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public long getIdUser() {
    return idUser;
  }

  public byte[] getFaceDescriptor() {
    return faceDescriptor.getBytes();
  }

  public void setFaceDescriptor(String faceDescriptor) {
    this.faceDescriptor = faceDescriptor;
  }

  public void setIdUser(long idUser) {
    this.idUser = idUser;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }
  @Column(name = "is_banned", columnDefinition = "boolean default false")
  private boolean banned = false;

  public boolean isBanned() {
    return banned;
  }

  public void setBanned(boolean banned) {
    this.banned = banned;
  }

  public String getResetToken() {
    return resetToken;
  }

  public void setResetToken(String resetToken) {
    this.resetToken = resetToken;
  }

  public LocalDateTime getTokenExpiryDate() {
    return tokenExpiryDate;
  }

  public void setTokenExpiryDate(LocalDateTime tokenExpiryDate) {
    this.tokenExpiryDate = tokenExpiryDate;
  }

  @Column(name = "reset_token")
  private String resetToken;

  @Column(name = "token_expiry_date")
  private LocalDateTime tokenExpiryDate;
}
