package esprit.tn.pidev.Services;
import esprit.tn.pidev.entities.Post;
import esprit.tn.pidev.entities.User;
import java.util.List;
import java.util.Map;

public interface IPostService {
    Post createPost(Post post, User author);
    Post getPostById(Long id);
    List<Post> getAllPosts();
    Post updatePost(Long postId, Post postDetails, User currentUser);
    void deletePost(Long postId, User currentUser);
    Post addTagToPost(Long postId, Long tagId);
    Post removeTagFromPost(Long postId, Long tagId);
    List <Post> getAllPostsByAuthorId(Long authorId);
    public List<Post> getAllPostsWithAuthor() ;
   public long getAuthorIdByPostId(Long postId);
   public Map<String ,Object> getPostWithAuthorName(Long postId);
    Post addTagsToPost(Long postId, List<String> tagNames);
    Post createPostWithTags(Post post, List<String> tagNames, User author);
    List<Post> getPostsByTag(String tagName);

  public int likePost(Long postId) ;

  public int getLikesCount(Long postId) ;

}
