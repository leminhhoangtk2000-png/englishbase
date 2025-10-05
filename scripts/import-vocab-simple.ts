import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

console.log('Starting import...');

async function test() {
  const contentDir = path.join(process.cwd(), 'src', 'content', 'a1niveau', 'vokabular');
  console.log('Content dir:', contentDir);
  console.log('Exists:', fs.existsSync(contentDir));
  
  if (fs.existsSync(contentDir)) {
    const folders = fs.readdirSync(contentDir);
    console.log('Folders:', folders.length);
    console.log('First 5:', folders.slice(0, 5));
  }
  
  await prisma.$disconnect();
}

test();
