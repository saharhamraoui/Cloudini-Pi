package esprit.tn.pidev.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "post")
public class Post {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column
  private String title;

  @Column(columnDefinition = "TEXT")
  private String content;

  @CreationTimestamp
  @Column(name = "created_at")
  private Date createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private Date updatedAt;

  @ManyToOne(cascade = CascadeType.PERSIST)
  @JoinColumn(name = "user_id", referencedColumnName = "idUser")
  @JsonBackReference
  private User author;

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Comment> comments = new ArrayList<>();

  @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
  @JoinTable(
    name = "post_tag",
    joinColumns = @JoinColumn(name = "post_id"),
    inverseJoinColumns = @JoinColumn(name = "tag_id")
  )
  private List<Tag> tags = new ArrayList<>();

  public Post(String title, String content, User author) {
    this.title = title;
    this.content = content;
    this.author = author;
    this.image = null;
  }

  @Lob
  @Column(name = "image", columnDefinition = "LONGBLOB")
  private byte[] image;
  @Getter
  @Column(name = "likes_count", columnDefinition = "INT DEFAULT 0")
  private int likesCount = 0;

  public void incrementLikes() {
    this.likesCount++;
  }

  public void decrementLikes() {
    if (this.likesCount > 0) {
      this.likesCount--;
    }
  }
}

