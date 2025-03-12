package tn.esprit.pi.Controllers;

import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.pi.Services.IMedicamentService;
import tn.esprit.pi.entities.Medicament;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/Medicament")
public class MedicamentController {
    @Autowired
    IMedicamentService MedicamentService;

    @PostMapping("/AddMedicament")
    public Medicament addMedicament(@RequestBody Medicament Medicament) {
        return MedicamentService.addMedicament(Medicament);
    }
    @PutMapping("/UpdateMedicament") //si id not found it adds it
    public Medicament updateMedicament(@RequestBody Medicament Medicament) {
        return MedicamentService.updateMedicament(Medicament);
    }
    @DeleteMapping("/DeleteMedicament/{idMedicament}")
    public void delete(@PathVariable Long idMedicament) {
        MedicamentService.deleteMedicament(idMedicament);
    }
    @GetMapping("/AllMedicaments")
    public List<Medicament> getAllMedicament(){
        return MedicamentService.getAllMedicament();
    }
    @GetMapping(("/GetMedicament/{idMedicament}"))
    Medicament getMedicament(@PathVariable Long idMedicament){
        return MedicamentService.getMedicament(idMedicament);
    }


}
