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
    title: "Convenors",
    members: [
      {
        name: "Aarav Nair",
        role: "Chief Convenor",
        photo: "/images/placeholder.jpg",
      },
      {
        name: "Meera Rao",
        role: "Co-Convenor",
        photo: "/images/placeholder.jpg",
      },
    ],
  },
  {
    title: "Student Convenors",
    members: [
      {
        name: "Kiran Shetty",
        role: "Student Convenor",
        photo: "/images/placeholder.jpg",
      },
      {
        name: "Divya R",
        role: "Student Convenor",
        photo: "/images/placeholder.jpg",
      },
      {
        name: "Yash M",
        role: "Student Convenor",
        photo: "/images/placeholder.jpg",
      },
    ],
  },
  {
    title: "Faculty Convenors",
    members: [
      {
        name: "Dr. Nandita S",
        role: "Faculty Convenor",
        photo: "/images/placeholder.jpg",
      },
      {
        name: "Prof. Ajay Kulkarni",
        role: "Faculty Convenor",
        photo: "/images/placeholder.jpg",
      },
    ],
  },
  {
    title: "Domain Convenors",
    members: [
      {
        name: "Shruti Menon",
        role: "Cultural Domain",
        photo: "/images/placeholder.jpg",
      },
      {
        name: "Rahul S",
        role: "Technical Domain",
        photo: "/images/placeholder.jpg",
      },
      {
        name: "Ananya Iyer",
        role: "Literary Domain",
        photo: "/images/placeholder.jpg",
      },
      {
        name: "Vikram P",
        role: "Sports Domain",
        photo: "/images/placeholder.jpg",
      },
    ],
  },
];
