import { Prisma, PrismaClient } from '@prisma/client'
import { Faker, pt_PT } from '@faker-js/faker';

import schedule from '../public/data/input/schedule.json'
import ucs from '../public/data/input/ucs.json'
import * as alocationJson from '../public/data/input/alocation.json';

type AlocationEntry = {
  uc: string;
  year: string;
  semester: string;
  type_class: string;
  shift: string;
  slots: (string | boolean)[][];
};
type Alocation = {
  [studentNr: string]: AlocationEntry[];
};
const alocation: Alocation = alocationJson;


interface id_uc{
  id: number;
}
const ucs_ids: {[id: string]: id_uc} = {}

function populate_ucs(){
  let result_ucs: Prisma.courseCreateInput[] = [];
  let i = 1;
  ucs.map((uc) => {
    let uc_to_add = {
      id: i,
      name: uc.uc,
      year: uc.ano,
      semester: uc.semestre
    }
    result_ucs.push(uc_to_add);
    ucs_ids[uc.uc] = {id: i};
    i++;
  })
  console.log(result_ucs)
  return result_ucs;
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

let classes: { 
  id: number;
  course_id: number;
  weekday: number; 
  start_time: string; 
  end_time: string; 
  local: string; 
  type: number; 
  shift: number; 
}[] = [];

function populate_classes(){
  let i = 1;

  schedule.map((class_schedule) =>{
    class_schedule.slots.map((slot) =>{
      let class_to_add = {
        id: i,
        course_id: ucs_ids[class_schedule.uc].id,
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


let students: {
  unique_id: number; 
  number: string; 
  firstname: string; 
  lastname: string; 
  email: string;
  //password: null
  is_admin: boolean;
}[] = [];
function populate_students(){
    let i = 1;
    const portugueseFaker = new Faker({ locale: [pt_PT] });

    Object.keys(alocation).map((student_nr) =>{
        let student = {
          unique_id: i,
          number: student_nr,
          firstname: portugueseFaker.person.firstName(),
          lastname: portugueseFaker.person.lastName(),
          email: student_nr + "@alunos.uminho.pt",
          //password: null
          is_admin: false
        }
        students.push(student);
        i++;
    })

    return students;
}



function populate_student_class() {
  let students_classes: { 
    id: number; 
    student_id: number | undefined; 
    lesson_id: number | undefined; 
  }[] = [];
  let i=1;

  Object.keys(alocation).forEach((studentNr) => {
    let entries = alocation[studentNr]
    if(Array.isArray(entries)){
      entries.map((student_class) => {
        let student_id = students.filter((student) => student.number == studentNr).at(0)?.unique_id;
        
        let uc_id = ucs_ids[student_class.uc].id;
        let type_class_int = type_class[student_class.type_class]
        let shift = parseInt(student_class.shift)
        student_class.slots.map((slot) =>{
          if(slot[0] != true && slot[0] != false){
            let weekday_int = weekdays[slot[0]]
            let start_time = slot[1] + ":" + slot[2]
            let end_time = slot[3] + ":" + slot[4]

            let class_id = classes.filter((class_check) => class_check.course_id == uc_id 
                                                        && class_check.type == type_class_int
                                                        && class_check.shift == shift
                                                        && class_check.weekday == weekday_int
                                                        && class_check.start_time == start_time
                                                        && class_check.end_time == end_time
            ).at(0)?.id
            let student_lesson = {
              id: i,
              student_id: student_id,
              lesson_id: class_id
            }
            students_classes.push(student_lesson);
            i++;
          }
        })
      })
    }
  });
  return students_classes
}


const prisma = new PrismaClient()

async function main() {
  
    let ucs: Prisma.courseCreateInput[] = populate_ucs();
    let classes = populate_classes();
    let students = populate_students();
    let students_classes = populate_student_class()

    await nuclear_bomb()

    ucs.map(async (uc) => {
      await prisma.course.create({
        data: uc
      })
    });

    
    students.map( async (student) => {
      await prisma.user.create({
        data: student
      })
    })

    classes.map(async (class_add) =>{
      await prisma.lesson.create({
        data: class_add
      })
    });
  
    students_classes.map( async (student_class) => {
      await prisma.student_lesson.create({
        data: student_class
      })
    });
    
   
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



async function nuclear_bomb(){
  await prisma.lesson_trade.deleteMany();

  await prisma.trade.deleteMany();
  await prisma.student_lesson.deleteMany()

  await prisma.lesson.deleteMany();
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();
}