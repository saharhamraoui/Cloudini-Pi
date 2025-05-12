package tn.esprit.pi.services;
import tn.esprit.pi.entities.Post;
import tn.esprit.pi.entities.User;

import java.util.List;
import java.util.Map;

public interface IPostService {
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

  public int likePost(Long postId , Long UserId) ;



  public int getLikesCount(Long postId) ;
  public Map<String, Object> toggleLike(Long postId, Long userId);
}

