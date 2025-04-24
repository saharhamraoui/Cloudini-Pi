package tn.esprit.pi.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String feedback;

    private String description;
    
    @Column
    private String emotion;


    @Column(nullable = false)
    private String category = "uncategorized";

    @Column(name = "ai_confidence", columnDefinition = "DECIMAL(3,2)") // Use DECIMAL instead of FLOAT
    private Double aiConfidence;

    @Enumerated(EnumType.STRING)
    private StatutReclamation status;

    @CreatedDate
    @Column(updatable = false)
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;

    @OneToMany(
            mappedBy = "reclamation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<Response> responses = new ArrayList<>();

    // Helper method to maintain bidirectional relationship
    public void addResponse(Response response) {
        responses.add(response);
        response.setReclamation(this);
    }
}