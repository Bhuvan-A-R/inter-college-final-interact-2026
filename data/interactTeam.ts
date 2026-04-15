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
        "photo": "/images/placeholder.jpg"
      },
      {
        "name": "Bhuvan A R",
        "role": "Technical / Registration",
        "photo": "/images/placeholder.jpg"
      },
      {
        "name": "Kusuma",
        "role": "Logistics / Creative",
        "photo": "/images/placeholder.jpg"
      },
      {
        "name": "Sagar",
        "role": "Stage / Hospitality",
        "photo": "/images/placeholder.jpg"
      },
      {
        "name": "Samarth Anoop",
        "role": "Marketing / Sponsorship",
        "photo": "/images/placeholder.jpg"
      },
      {
        "name": "Sharath",
        "role": "Sports / Accommodation",
        "photo": "/images/placeholder.jpg"
      },
      {
        "name": "Sohan S K",
        "role": "Culturals / Program",
        "photo": "/images/placeholder.jpg"
      },
      {
        "name": "Tejas Varma",
        "role": "Discipline / Transportation",
        "photo": "/images/placeholder.jpg"
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
