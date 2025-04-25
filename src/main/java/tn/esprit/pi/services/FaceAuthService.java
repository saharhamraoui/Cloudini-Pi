package tn.esprit.pi.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.User;
import tn.esprit.pi.repositories.UserRepository;

import java.nio.ByteBuffer;
import java.nio.FloatBuffer;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class FaceAuthService {

    @Autowired
    private UserRepository userRepository;

    private static final float THRESHOLD = 0.6f; // Seuil de similarité

    public void registerFace(Long userId, float[] descriptor) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ByteBuffer buffer = ByteBuffer.allocate(descriptor.length * Float.BYTES);
        buffer.asFloatBuffer().put(descriptor);
        user.setFaceDescriptor(Arrays.toString(buffer.array()));

        userRepository.save(user);
    }

    public Optional<User> recognizeUser(float[] inputDescriptor) {
        List<User> users = userRepository.findAllUsersWithDescriptors();

        return users.stream()
                .filter(u -> u.getFaceDescriptor() != null)
                .min((u1, u2) -> {
                    float d1 = calculateDistance(inputDescriptor, convertBytesToFloats(u1.getFaceDescriptor()));
                    float d2 = calculateDistance(inputDescriptor, convertBytesToFloats(u2.getFaceDescriptor()));
                    return Float.compare(d1, d2);
                })
                .filter(user -> {
                    float distance = calculateDistance(
                            inputDescriptor,
                            convertBytesToFloats(user.getFaceDescriptor())
                    );
                    return distance < THRESHOLD;
                });
    }

    private float[] convertBytesToFloats(byte[] bytes) {
        FloatBuffer floatBuffer = ByteBuffer.wrap(bytes).asFloatBuffer();
        float[] floats = new float[floatBuffer.remaining()];
        floatBuffer.get(floats);
        return floats;
    }

    private float calculateDistance(float[] a, float[] b) {
        // Add validation
        if (a == null || b == null || a.length != b.length || a.length == 0) {
            return Float.MAX_VALUE; // Or throw an exception
        }

        float sum = 0;
        for (int i = 0; i < a.length; i++) {
            sum += Math.pow(a[i] - b[i], 2);
        }
        return (float) Math.sqrt(sum);
    }
}
