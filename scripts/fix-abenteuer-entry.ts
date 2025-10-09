#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixAbenteuerEntry() {
  try {
    // Kiểm tra entry hiện tại
    const currentEntry = await prisma.vocabularyEntry.findFirst({
      where: {
        german: 'Abenteuer erleben'
      }
    });
    
    console.log('Current entry:', JSON.stringify(currentEntry, null, 2));
    
    if (currentEntry) {
      // Cập nhật entry để có định dạng chuẩn
      const updatedEntry = await prisma.vocabularyEntry.update({
        where: {
          id: currentEntry.id
        },
        data: {
          type: 'OTHER',
          exampleGerman: 'Im Dschungel haben wir viele aufregende Abenteuer erlebt.',
          exampleVietnamese: 'Trong rừng rậm, chúng tôi đã trải nghiệm nhiều cuộc phiêu lưu thú vị.'
        }
      });
      
      console.log('✅ Updated entry:', JSON.stringify(updatedEntry, null, 2));
    } else {
      console.log('❌ Entry not found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAbenteuerEntry();
