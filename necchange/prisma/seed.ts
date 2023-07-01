import { Prisma, PrismaClient } from '@prisma/client'
import schedule from '../public/data/input/schedule.json'

const prisma = new PrismaClient()

interface id_uc{
  id: number;
}
const ucs_ids: {[id: string]: id_uc} = {}

function populate_ucs(){
  let ucs: Prisma.ucCreateInput[] = [];
  let ucs_names: Array<string> = [];
  let i = 1;
  schedule.map((class_schedule) => {
    if(!ucs_names.includes(class_schedule.uc)){
      ucs_names.push(class_schedule.uc);
      let uc = {
        id: i,
        name: class_schedule.uc,
        year: parseInt(class_schedule.year),
        semester: parseInt(class_schedule.semester)
      }
      ucs.push(uc);
      ucs_ids[class_schedule.uc] = {id: i};
      i++;
    }
  })
  return ucs;
} 

const weekdays: Record<string, number> = {};
weekdays['Segunda'] = 1;
weekdays['Terça'] = 2;
weekdays['Quarta'] = 3;
weekdays['Quinta'] = 4;
weekdays['Sexta'] = 5;

const type_class: Record<string, number> = {}
type_class['T'] = 1;
type_class['TP'] = 2;
type_class['PL'] = 3;

function populate_classes(){
  let classes: { 
    id: number;
    uc_id: number;
    weekday: number; 
    start_time: string; 
    end_time: string; 
    local: string; 
    type: number; 
    shift: number; 
  }[] = [];
  let i = 1;

  schedule.map((class_schedule) =>{
    class_schedule.slots.map((slot) =>{
      let class_to_add = {
        id: i,
        uc_id: ucs_ids[class_schedule.uc].id,
        weekday: weekdays[slot[0]],
        start_time: slot[1] + ":" + slot[2],
        end_time: slot[3] + ":" + slot[4],
        local: slot[5],
        type: type_class[class_schedule.type_class],
        shift: parseInt(class_schedule.shift)
      };
      classes.push(class_to_add);
      i++;
    })
  })

  return classes
}

async function main() {
  
  let ucs: Prisma.ucCreateInput[] = populate_ucs();
  let classes = populate_classes();

  classes.map(async (class_add) =>{
    await prisma.renamedclass.create({
      data: class_add
    })
  })
  
  
  ucs.map(async (uc) => {
    await prisma.uc.create({
      data: uc
    })
  })
  
   
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })