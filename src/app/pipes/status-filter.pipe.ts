import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFilter'
})
export class StatusFilterPipe implements PipeTransform {

  
  transform(commandes: any[], statut: string): any[] {
    if (!statut) return commandes;
    return commandes.filter(commande => commande.status === statut);
  }
}
