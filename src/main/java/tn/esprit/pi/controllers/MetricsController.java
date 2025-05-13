package tn.esprit.pi.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tn.esprit.pi.entities.Reclamation;
import tn.esprit.pi.services.ReclamationMetricsService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/metrics")
public class MetricsController {

    private final ReclamationMetricsService metricsService;

    public MetricsController(ReclamationMetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @GetMapping("/reclamations")
    public Map<String, Object> getReclamationMetrics() {
        return metricsService.getSystemMetrics();
    }

    @GetMapping("/top5")
    public List<Reclamation> getTop5ActiveReclamations() {
        return metricsService.getTop5ActiveReclamations();
    }

    @GetMapping("/category-distribution")
    public Map<String, Long> getCategoryDistribution() {
        return metricsService.getCategoryDistribution();
    }

}
