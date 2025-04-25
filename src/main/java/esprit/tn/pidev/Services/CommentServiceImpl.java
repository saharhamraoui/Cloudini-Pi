package esprit.tn.pidev.Services;

import esprit.tn.pidev.entities.*;
import esprit.tn.pidev.Repositories.CommentRepository;
import esprit.tn.pidev.Repositories.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Builder
@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements ICommentService {

  private final CommentRepository commentRepository;
  private final PostRepository postRepository;
  private final INotificationService notificationService;

  @Override
  @Transactional
  public Comment createComment(Long postId, String content, User author) {
    if (author.getRole() != Role.MEDECIN && author.getRole() != Role.PATIENT) {
      throw new IllegalStateException("Seuls les médecins et patients peuvent commenter");
    }

    Post post = postRepository.findById(postId)
      .orElseThrow(() -> new EntityNotFoundException("Post non trouvé"));

    Comment comment = new Comment();
    comment.setContent(content);
    comment.setPost(post);
    comment.setAuthor(author);

    Comment savedComment = commentRepository.save(comment);

    if (post.getAuthor().getIdUser() != author.getIdUser()) {
      notificationService.notifyNewComment(post.getAuthor(), savedComment);
    }

    return savedComment;
  }

  // Nouvelle méthode implémentée pour les réponses
  @Override
  @Transactional
  public Comment createReply(Long parentCommentId, String content, User author) {
    if (author.getRole() != Role.MEDECIN && author.getRole() != Role.PATIENT) {
      throw new IllegalStateException("Seuls les médecins et patients peuvent répondre aux commentaires");
    }

    Comment parentComment = commentRepository.findById(parentCommentId)
      .orElseThrow(() -> new EntityNotFoundException("Commentaire parent non trouvé"));

    Comment reply = new Comment();
    reply.setContent(content);
    reply.setPost(parentComment.getPost());
    reply.setAuthor(author);
    reply.setParentComment(parentComment);

    Comment savedReply = commentRepository.save(reply);

    if (parentComment.getAuthor().getIdUser() != author.getIdUser()) {
      notificationService.notifyNewReply(parentComment.getAuthor(), savedReply);
    }

    return savedReply;
  }

  // Méthode existante modifiée pour ne retourner que les commentaires principaux
  @Override
  public Page<Comment> getCommentsByPost(Long postId, Pageable pageable) {
    return commentRepository.findByPostIdAndParentCommentIsNull(postId, pageable);
  }

  // Nouvelle méthode pour les réponses
  @Override
  public Page<Comment> getRepliesByComment(Long commentId, Pageable pageable) {
    if (!commentRepository.existsById(commentId)) {
      throw new EntityNotFoundException("Commentaire non trouvé");
    }
    return commentRepository.findByParentCommentId(commentId, pageable);
  }

  // Votre méthode existante inchangée
  @Override
  @Transactional
  public Comment updateComment(Long commentId, String newContent, User currentUser) {
    Comment comment = commentRepository.findById(commentId)
      .orElseThrow(() -> new EntityNotFoundException("Commentaire non trouvé"));

    if (comment.getAuthor().getIdUser() != currentUser.getIdUser()) {
      throw new IllegalStateException("Vous ne pouvez modifier que vos propres commentaires");
    }

    comment.setContent(newContent);
    return commentRepository.save(comment);
  }

  // Votre méthode existante inchangée
  @Override
  @Transactional
  public void deleteComment(Long commentId, User currentUser) {
    Comment comment = commentRepository.findById(commentId)
      .orElseThrow(() -> new EntityNotFoundException("Commentaire non trouvé"));

    if (comment.getAuthor().getIdUser() != currentUser.getIdUser()) {
      throw new IllegalStateException("Vous ne pouvez supprimer que vos propres commentaires");
    }

    commentRepository.delete(comment);
  }
}
