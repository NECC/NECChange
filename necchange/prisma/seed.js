const { PrismaClient, Role } = require("@prisma/client");
const { Faker, pt_PT } = require("@faker-js/faker");
const schedule = require("../public/data/input/schedule.json");
const ucs = require("../public/data/input/ucs.json");
const alocationJson = require("../public/data/input/alocation.json");
const axios = require("axios");

const alocation = alocationJson;

const ucs_ids = {};

async function populate_ucs() {
  let result_ucs = [];
  let i = 1;
  Promise.all(
    ucs.map((uc) => {
      let uc_to_add = {
        id: i,
        name: uc.uc,
        year: uc.ano,
        semester: uc.semestre,
      };
      result_ucs.push(uc_to_add);
      ucs_ids[uc.uc] = { id: i };
      i++;
    })
  );
  console.log(result_ucs);
  return result_ucs;
}

const weekdays = {
  Segunda: 1,
  Terça: 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
};

const type_class = {
  T: 1,
  TP: 2,
  PL: 3,
};

let classes = [];

async function populate_classes() {
  let i = 1;
  Promise.all(
    schedule.map((class_schedule) => {
      class_schedule.slots.map((slot) => {
        let class_to_add = {
          id: i,
          course_id: ucs_ids[class_schedule.uc].id,
          weekday: weekdays[slot[0]],
          start_time: slot[1] + ":" + slot[2],
          end_time: slot[3] + ":" + slot[4],
          local: slot[5],
          type: type_class[class_schedule.type_class],
          shift: parseInt(class_schedule.shift),
        };
        classes.push(class_to_add);
        i++;
      });
    })
  );

  return classes;
}

/*
function encrypt(number) {
  const split_string = number.split("");

  const start = [split_string[0], split_string[1]];
  const decodedNr = split_string.slice(2).reverse();

  const number_decoded = start.concat(decodedNr);

  return number_decoded.join("");
}
*/
let users = [];
let i = 0;
async function populate_students() {
  const portugueseFaker = new Faker({ locale: [pt_PT] });

  Promise.all(
    Object.keys(alocation).map(async (student_nr) => {
      if (student_nr != "default") {
        let user = {
          uniqueId: i,
          number: student_nr,
          partnerNumber: null,
          name: portugueseFaker.person.firstName(),
          email: student_nr.toLowerCase() + "@alunos.uminho.pt",
          partner: false,
          role: Role.CS_STUDENT,
        };
        users.push(user);
        i++;
      }
    })
  );
}

async function populate_partners() {
  let partners = [];

  // api call to get NECC partners from a partner sheet
  const partnersSheet = await axios
    .get(
      `https://sheetdb.io/api/v1/${process.env.NEXT_PUBLIC_SHEETDB_ID}?sort_by=Nº&sort_order=asc&offset=369`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            btoa(
              `${process.env.NEXT_PUBLIC_SHEETDB_LOGIN}:${process.env.NEXT_PUBLIC_SHEETDB_PASSWORD}`
            ),
        },
      }
    )
    .then((res) => {
      console.log(res[0]);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });

  partnersSheet.map((partner) => {
    partnerAcademicNumber = partner["Numero"].trim().toUpperCase();
    partnerNumber = parseInt(partner["Nº"]);
    partnerName = partner["Nome"];
    partnerPhone = partner["Telefone"];

    // check whether the student is from computer science or not 
    const role =
      users.filter((user) => user.number.toUpperCase() == partnerAcademicNumber)
        .length !== 0
        ? Role.CS_STUDENT
        : Role.OUTSIDER;
    
    // in case he is, change partner flag to true
    if(role == Role.CS_STUDENT){
      const cs_student_partner = users.filter((user) => user.number.toUpperCase() == partnerAcademicNumber)
      cs_student_partner[0].partner = true;
      cs_student_partner[0].partnerNumber = partnerNumber;
      cs_student_partner[0].name = partnerName;
      cs_student_partner[0].phone = partnerPhone;
    } else {
    // in case he isn't, add him to the database
      partners.push({
        uniqueId: i,
        partnerNumber: partnerNumber,
        number: partnerAcademicNumber,
        name: partnerName,
        email: partnerAcademicNumber.trim().toLowerCase() + "@alunos.uminho.pt",
        phone: partnerPhone,
        partner: true,
        role: role,
      });
    }
    i++;
  });

  // add super users
  email_super_users = [
    "neccuminho06@gmail.com",
    "recreativo@necc.di.uminho.pt",
    "pedagogico@necc.di.uminho.pt",
    "comunicacao@necc.di.uminho.pt",
    "dev@necc.di.uminho.pt",
  ];
  email_super_users.map((email_super_user) => {
    partners.push({
      uniqueId: i,
      name: email_super_user.split("@")[0],
      email: email_super_user,
      phone: null,
      partner: true,
      role: Role.SUPER_USER,
    });
    i++;
  });

  return partners;
}

async function populate_student_class() {
  let students_classes = [];
  let i = 1;

  Object.keys(alocation).forEach((studentNr) => {
    let entries = alocation[studentNr];
    if (Array.isArray(entries)) {
      Promise.all(
        entries.map((student_class) => {
          let student_id = users
            .filter((student) => student.number == studentNr)
            .at(0)?.uniqueId;

          let uc_id = ucs_ids[student_class.uc].id;
          let type_class_int = type_class[student_class.type_class];
          let shift = parseInt(student_class.shift);
          student_class.slots.map((slot) => {
            if (slot[0] != true && slot[0] != false) {
              let weekday_int = weekdays[slot[0]];
              let start_time = slot[1] + ":" + slot[2];
              let end_time = slot[3] + ":" + slot[4];

              let class_id = classes
                .filter(
                  (class_check) =>
                    class_check.course_id == uc_id &&
                    class_check.type == type_class_int &&
                    class_check.shift == shift &&
                    class_check.weekday == weekday_int &&
                    class_check.start_time == start_time &&
                    class_check.end_time == end_time
                )
                .at(0)?.id;
              let student_lesson = {
                id: i,
                student_id: student_id,
                lesson_id: class_id,
              };
              students_classes.push(student_lesson);
              i++;
            }
          });
        })
      );
    }
  });
  return students_classes;
}

const prisma = new PrismaClient();

async function main() {
  //const ucs = await populate_ucs();
  //const classes = await populate_classes();
  //await populate_students();
  //const students_classes = await populate_student_class();

  const partners = await populate_partners();

  console.log("A apagar tudo!");
  await nuclear_bomb();

  console.log("A introduzir tradePeriods");
  await prisma.tradePeriods.create({
    data: {
      isOpen: false,
    },
  });

  await Promise.all(
    partners.map(async (partner) => {
      //console.log(partner);
      await prisma.user.create({
        data: partner,
      });
    })
  );

  
  // console.log("A introduzir courses");
  // ucs.map(async (uc) => {
  //   await prisma.course.create({
  //     data: uc,
  //   });
  // });

  console.log("A introduzir users");
  await Promise.all(
    users.map(async (user) => {
      await prisma.user.create({
        data: user,
      });
    })
  );
  
  // console.log("A introduzir lessons");
  // await Promise.all(
  //   classes.map(async (class_add) => {
  //     await prisma.lesson.create({
  //       data: class_add,
  //     });
  //   })
  // );

  /* console.log("A introduzir student_lessons");
  await Promise.all(
    students_classes.map(async (student_class) => {
      await prisma.student_lesson.create({
        data: student_class,
      });
    })
  ); */
  
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function nuclear_bomb() {
  await prisma.lesson_trade.deleteMany();

  await prisma.trade.deleteMany();
  await prisma.student_lesson.deleteMany();

  await prisma.lesson.deleteMany();
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();
  await prisma.tradePeriods.deleteMany();
}
