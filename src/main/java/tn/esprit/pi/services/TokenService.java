package tn.esprit.pi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.Security.JwtUtil;
import tn.esprit.pi.entities.User;

@Service
public class TokenService {

    private final JwtUtil jwtUtil;

    @Autowired
    public TokenService(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    public String generateToken(User user) {
        return jwtUtil.generateToken(user.getEmail());
    }
}