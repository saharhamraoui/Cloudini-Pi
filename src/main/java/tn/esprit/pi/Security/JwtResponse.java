package tn.esprit.pi.Security;

import tn.esprit.pi.entities.Role;

public class JwtResponse {
    private String firstName;  // Ajouté

    private String token;
    private String email;
    private Role role;
    private Long idUser; // Ajouter idUser

    public void setToken(String token) {
        this.token = token;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public JwtResponse(String token, String email, String firstName, Role role, Long idUser ) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.idUser = idUser;
    }

    public String getToken() { return token; }
    public String getEmail() { return email; }
    public Role getRole()
    {
        return role;
    }
    public Long getIdUser() { return idUser; }}
