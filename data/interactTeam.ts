export type TeamMember = {
  name: string;
  role: string;
  photo: string;
};

export type TeamSection = {
  title: string;
  members: TeamMember[];
};

export const interactTeamSections: TeamSection[] = [
  {
    title: "Faculty Convenors",
    members: [
      {
        name: "Lt. Saravanan ",
        role: "Faculty Convenor",
        photo: "/images/placeholder.jpg",
      },
      // {
      //   name: "Prof. Ajay Kulkarni",
      //   role: "Faculty Convenor",
      //   photo: "/images/placeholder.jpg",
      // },
    ],
  },
  {
    title: "Convenors",
    members: [
      {
        "name": "Anoop S J",
        "role": "Media",
        "photo": "/convenors/Anoop S J.png"
      },
      {
        "name": "Bhuvan A R",
        "role": "Technical / Registration",
        "photo": "/convenors/Bhuvan A R.png"
      },
      {
        "name": "Kusuma",
        "role": "Logistics / Creative",
        "photo": "/convenors/Kusuma.png"
      },
      {
        "name": "Sagar",
        "role": "Stage / Hospitality",
        "photo": "/convenors/Sagar.png"
      },
      {
        "name": "Samarth Anoop",
        "role": "Marketing / Sponsorship",
        "photo": "/convenors/Samarth Anoop.png"
      },
      {
        "name": "Sharath",
        "role": "Sports / Accommodation",
        "photo": "/convenors/Sharath.png"
      },
      {
        "name": "Sohan S K",
        "role": "Culturals / Program",
        "photo": "/convenors/Sohan S K.png"
      },
      {
        "name": "Tejas Varma",
        "role": "Discipline / Transportation",
        "photo": "/convenors/Tejas Varma.png"
      }
    ]
  },
  // {
  //   title: "Student Convenors",
  //   members: [
  //     {
  //       name: "Kiran Shetty",
  //       role: "Student Convenor",
  //       photo: "/images/placeholder.jpg",
  //     },
  //     {
  //       name: "Divya R",
  //       role: "Student Convenor",
  //       photo: "/images/placeholder.jpg",
  //     },
  //     {
  //       name: "Yash M",
  //       role: "Student Convenor",
  //       photo: "/images/placeholder.jpg",
  //     },
  //   ],
  // },

  // {
  //   title: "Domain Convenors",
  //   members: [
  //     {
  //       name: "Shruti Menon",
  //       role: "Cultural Domain",
  //       photo: "/images/placeholder.jpg",
  //     },
  //     {
  //       name: "Rahul S",
  //       role: "Technical Domain",
  //       photo: "/images/placeholder.jpg",
  //     },
  //     {
  //       name: "Ananya Iyer",
  //       role: "Literary Domain",
  //       photo: "/images/placeholder.jpg",
  //     },
  //     {
  //       name: "Vikram P",
  //       role: "Sports Domain",
  //       photo: "/images/placeholder.jpg",
  //     },
  //   ],
  // },
];
