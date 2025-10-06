// Prisma Schema Addition - Exercise Master Table

model Exercise {
  id          String   @id @default(cuid())
  slug        String   @unique // Full path: "a1/Horen/Im Restaurant teil 2 - A1"
  slugId      String   @unique // Slugified: "a1-horen-im-restaurant-teil-2-a1"
  
  // Metadata
  title       String
  level       String   // a1, a2, b1, b2
  category    String   // Horen, Lesen, Schreiben, Sprechen
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations (for future stats aggregation)
  // ratings     ExerciseRating[]
  // views       ExerciseView[]
  // comments    ExerciseComment[]
  // completions ExerciseCompletion[]
  
  @@index([level])
  @@index([category])
  @@index([slugId])
  @@map("exercises_master")
}

// Update existing models to reference Exercise
model exercise_ratings {
  id         String   @id @default(cuid())
  exerciseId String   // Now references Exercise.slugId
  userId     String
  isLiked    Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  
  // Add relation (optional)
  // exercise   Exercise @relation(fields: [exerciseId], references: [slugId])

  @@unique([exerciseId, userId])
  @@index([exerciseId])
  @@map("exercise_ratings")
}

// Similar updates for other exercise_* tables
