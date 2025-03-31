package esprit.tn.pidev.Services;
import esprit.tn.pidev.entities.Post;
import esprit.tn.pidev.entities.User;
import java.util.List;
public interface IPostService {
    Post createPost(Post post, User author);

    Post getPostById(Long id);

    List<Post> getAllPosts();

    Post updatePost(Long postId, Post postDetails, User currentUser);

    void deletePost(Long postId, User currentUser);

    Post addTagToPost(Long postId, Long tagId);

    Post removeTagFromPost(Long postId, Long tagId);
}