package tn.esprit.pi.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import tn.esprit.pi.entities.Reclamation;
import tn.esprit.pi.entities.StatutReclamation;
import tn.esprit.pi.repository.ReclamationRepository;

import java.sql.Date;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReclamationMetricsService {

    private final ReclamationRepository reclamationRepository;

    public Map<String, Object> getSystemMetrics() {  // Keep this method name to match controller
        List<Reclamation> all = reclamationRepository.findAll();

        return Map.of(
                "totalReclamations", all.size(),
                "avgResolutionHours", calculateAvgResolutionTime(all),
                "statusDistribution", groupByStatus(all),
                "categoryDistribution", groupByCategory(all),
                "last7DaysActivity", countLastWeekActivity(all)
        );
    }
    private Map<String, Long> groupByCategory(List<Reclamation> reclamations) {
        return reclamations.stream()
                .collect(Collectors.groupingBy(
                        r -> r.getCategory() != null ? r.getCategory() : "uncategorized",
                        Collectors.counting()
                ));
    }


    private double calculateAvgResolutionTime(List<Reclamation> reclamations) {
        return reclamations.stream()
                .filter(r -> r.getStatus() == StatutReclamation.RESOLVED)
                .filter(r -> r.getCreatedAt() != null && r.getUpdatedAt() != null)
                .mapToLong(r -> ChronoUnit.HOURS.between(
                        r.getCreatedAt().toInstant(),
                        r.getUpdatedAt().toInstant()
                ))
                .average()
                .orElse(0.0);
    }

    private Map<StatutReclamation, Long> groupByStatus(List<Reclamation> reclamations) {
        return reclamations.stream()
                .collect(Collectors.groupingBy(
                        Reclamation::getStatus,
                        Collectors.counting()
                ));
    }

    private Map<LocalDate, Long> countLastWeekActivity(List<Reclamation> reclamations) {
        return reclamations.stream()
                .filter(r -> r.getCreatedAt() != null &&
                        r.getCreatedAt().after(Date.from(Instant.now().minus(7, ChronoUnit.DAYS))))
                .collect(Collectors.groupingBy(
                        r -> r.getCreatedAt().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
                        Collectors.counting()
                ));
    }

    public List<Reclamation> getTop5ActiveReclamations() {
        return reclamationRepository.findAll().stream()
                .sorted((r1, r2) -> Integer.compare(
                        r2.getResponses().size(),
                        r1.getResponses().size()))
                .limit(5)
                .collect(Collectors.toList());
    }

    public Map<String, Long> getCategoryDistribution() {
        List<Reclamation> all = reclamationRepository.findAll();
        return groupByCategory(all);
    }

}
