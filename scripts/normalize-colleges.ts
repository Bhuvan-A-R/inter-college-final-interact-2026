import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { colleges } from "../data/colleges";

dotenv.config();

const prisma = new PrismaClient();

// Flatten the colleges list from all regions
const validColleges = colleges.flatMap(region => region.colleges);
const validCollegeNames = new Set(validColleges.map(c => c.name.toUpperCase()));

// Create a map for key-based matching (remove spaces, dots, hyphens)
const keyToCollegeName = new Map<string, string>();
validColleges.forEach(c => {
  const key = c.name.toUpperCase().replace(/[\s\.-]/g, "");
  keyToCollegeName.set(key, c.name.toUpperCase());
});

// Mapping of known variations/typos/abbreviations to standard names in colleges.ts
const specialMappings: { [key: string]: string } = {
  // Global Academy of Technology
  "GAT": "GLOBAL ACADEMY OF TECHNOLOGY",
  "GLOBAL ACAENMEY IOF TEHCNOLOGY": "GLOBAL ACADEMY OF TECHNOLOGY",
  "GLOBAL ACADEMY OF TECHNOLOGICAL": "GLOBAL ACADEMY OF TECHNOLOGY",
  "GLOBAL ACADEMY TECHNOLOGY": "GLOBAL ACADEMY OF TECHNOLOGY",
  "GLOBAL COLLEGE OF TECHNOLOGY": "GLOBAL ACADEMY OF TECHNOLOGY",
  
  // RNSIT
  "RNSIT": "RNS INSTITUTE OF TECHNOLOGY",
  "R N S INSTITUE OF TECHNOLOGY": "RNS INSTITUTE OF TECHNOLOGY",
  
  // Vemana
  "VEMANA IT": "VEMANA INSTITUTE OF TECHNOLOGY",
  
  // Gogte
  "GIT": "KLS GOGTE INSTITUTE OF TECHNOLOGY",
  "KLS GOOGTE INSTITUTE OF TECHNOLOGY BELGAVI": "KLS GOGTE INSTITUTE OF TECHNOLOGY",
  
  // Acharya (Handling typo in data/colleges.ts line 6 "ACHARAYA")
  "ACHARYA INSTITUTE OF TECHNOLOGY": "ACHARAYA INSTITUTE OF TECHNOLOGY", 
  "ACHARYA INSTITUTE OF TECNOLOGY": "ACHARAYA INSTITUTE OF TECHNOLOGY",
  
  // BMSIT
  "BMS INSTITUTE OF TECHNOLOGY AND MANAGEMENT": "BMS INSTITUTE OF TECHNOLOGY",
  
  // KSSEM
  "K S SCHOOL OF ENGINEERING AND MANAGEMENT": "K.S SCHOOL OF ENGG & MGMT",
  
  // Basaveshwar
  "BASAVESHWAR ENGINEERING COLLEGE, BAGALKOT": "BASAVESHWARA ENGINERING COLLEGE",
  
  // BNMIT
  "BNM ISNTITUTE OF TECHNOLOGY": "B.N.M.INSTITUTE OF TECHNOLOGY",
  
  // Others
  "BIET,DAVANAGERE": "BAPUJI INSTITUTE OF ENGINEERING AND TECHNOLOGY",
  "EAST WEST INSTITUTIONS OF TECHNOLOGY": "EAST WEST INSTITUTE OF TECHNOLOGY",
  "SAHYADRI COLLEGE OF ENGINEERING AND MANAGEMENT": "SAHYADRI INSTITUTE OF TECH. & MGMT., MANGALURU",
  "SG BALEKUNDRI INSTITUTE OF TECHNOLOGY": "S G BALEKUNDRI INST. OF TECH",
  "SJB INSTITUTE OF TECHNOLOJY": "SJB INSTITUTE OF TECHNOLOGY",
  "SHRIDEVI INSTITUTE OF ENGINEERING AND TECHNOLOGY, TUMKUR": "SHRIDEVI INSTITUTE OF ENGINEERING AND TECHNOLOGY",
};

function normalizeCollegeName(name: string): string {
  if (!name) return "";
  
  // Basic cleanup
  let cleaned = name.trim().replace(/\s+/g, " ").toUpperCase();
  
  // Check special mappings first
  if (specialMappings[cleaned]) {
    return specialMappings[cleaned];
  }
  
  // Try to remove common suffixes and check special mappings again
  let simplified = cleaned.replace(/, BENGALURU$/, "");
  simplified = simplified.replace(/ BENGALURU$/, "");
  simplified = simplified.replace(/,$/, "");
  
  if (specialMappings[simplified]) {
    return specialMappings[simplified];
  }
  
  // Check if it's already a valid college name
  if (validCollegeNames.has(cleaned)) {
    return cleaned;
  }
  
  if (validCollegeNames.has(simplified)) {
    return simplified;
  }
  
  // Key-based matching (remove spaces, dots, hyphens)
  const key = cleaned.replace(/[\s\.-]/g, "");
  if (keyToCollegeName.has(key)) {
    return keyToCollegeName.get(key)!;
  }
  
  const simplifiedKey = simplified.replace(/[\s\.-]/g, "");
  if (keyToCollegeName.has(simplifiedKey)) {
    return keyToCollegeName.get(simplifiedKey)!;
  }
  
  // Specific case for "GOGTE INSTITUTE OF TECHNOLOGY" which might have city in name
  if (cleaned.includes("GOGTE INSTITUTE OF TECHNOLOGY")) {
    return "KLS GOGTE INSTITUTE OF TECHNOLOGY";
  }
  
  // If still not found, return the cleaned version
  return cleaned;
}

async function main() {
  console.log("Fetching users from database...");
  const users = await prisma.user.findMany({
    select: {
      id: true,
      collegeName: true,
    },
  });

  console.log(`Found ${users.length} users.`);
  
  const stats = new Map<string, { originalNames: Set<string>, count: number, isValid: boolean }>();

  for (const user of users) {
    if (!user.collegeName) continue;
    
    const original = user.collegeName;
    const normalized = normalizeCollegeName(original);
    const isValid = validCollegeNames.has(normalized);
    
    if (!stats.has(normalized)) {
      stats.set(normalized, { originalNames: new Set<string>(), count: 0, isValid });
    }
    
    const data = stats.get(normalized)!;
    data.originalNames.add(original);
    data.count++;
  }

  console.log("\n--- Normalization Results ---");
  const sortedColleges = Array.from(stats.keys()).sort();
  
  let validCount = 0;
  let invalidCount = 0;

  for (const normalized of sortedColleges) {
    const data = stats.get(normalized)!;
    const status = data.isValid ? "✅ MATCHED" : "❌ UNMATCHED";
    
    if (data.isValid) validCount += data.count;
    else invalidCount += data.count;

    console.log(`\nNormalized: ${normalized} [${status}] (${data.count} users)`);
    console.log("  Original variations:");
    data.originalNames.forEach(orig => {
      console.log(`    - "${orig}"`);
    });
  }
  
  console.log("\n--- Summary ---");
  console.log(`Total users with college: ${validCount + invalidCount}`);
  console.log(`Successfully matched: ${validCount}`);
  console.log(`Unmatched: ${invalidCount}`);
  
  console.log("\nTo use this in your stats script, you can import the normalizeCollegeName function.");
  
  // Updating the database with normalized names as requested by the user
  console.log("\nUpdating database with normalized names...");
  let updateCount = 0;
  for (const user of users) {
    if (!user.collegeName) continue;
    const normalized = normalizeCollegeName(user.collegeName);
    if (normalized !== user.collegeName) {
      await prisma.user.update({
        where: { id: user.id },
        data: { collegeName: normalized },
      });
      updateCount++;
    }
  }
  console.log(`Updated ${updateCount} users in the database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
