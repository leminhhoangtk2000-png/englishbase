'use client';

import React from 'react';

interface ExerciseRendererProps {
  htmlContent: string;
}

export function ExerciseRenderer({ htmlContent }: ExerciseRendererProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Decode HTML entities that may have been escaped
  const decodedHtml = React.useMemo(() => {
    return htmlContent
      .replace(/&#x3C;/g, '<')
      .replace(/&#x3E;/g, '>')
      .replace(/&#x26;/g, '&')
      .replace(/&#x27;/g, "'")
      .replace(/&#x22;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
  }, [htmlContent]);

  React.useEffect(() => {
    if (!containerRef.current) return;

    // Initialize exercise functionality manually without eval
    const container = containerRef.current;
    
    // Look for script tags with exercise initialization code
    const scripts = container.querySelectorAll('script:not([type="application/json"])');
    scripts.forEach(script => {
      try {
        // Execute the script content to initialize exercises
        const scriptContent = script.textContent || script.innerHTML;
        if (scriptContent.includes('interactive-exercise')) {
          const func = new Function(scriptContent);
          func();
        }
      } catch (error) {
        console.error('Error executing script:', error);
      }
    });

    function createInteractiveExercise(data: any) {
      const { title, subtitle, exercises } = data;
      
      return `
        <div class="interactive-exercise w-full max-w-5xl mx-auto my-8 border rounded-lg shadow-sm">
          <div class="p-6 border-b">
            <h3 class="text-2xl font-bold text-center mb-2">${title}</h3>
            ${subtitle ? `<p class="text-center text-gray-600 dark:text-gray-400">${subtitle}</p>` : ''}
          </div>
          
          <div class="p-6 space-y-6">
            <!-- Control Buttons -->
            <div class="flex flex-wrap gap-2 justify-center">
              <button class="check-all-btn px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Kiểm tra tất cả
              </button>
              <button class="reset-btn px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Làm lại
              </button>
              <button class="show-answers-btn px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span class="show-answers-text">Hiện đáp án</span>
              </button>
            </div>
            
            <!-- Results Badge -->
            <div class="results-badge text-center hidden">
              <span class="inline-block px-4 py-2 border rounded-lg font-semibold"></span>
            </div>
            
            <!-- Exercises -->
            <div class="exercises-container space-y-4">
              ${exercises.map((exercise: any) => `
                <div class="exercise-item p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50" data-exercise-id="${exercise.id}">
                  <div class="flex items-start gap-4">
                    <div class="exercise-number w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-sm font-medium text-blue-800 dark:text-blue-200">
                      ${exercise.id}
                    </div>
                    <div class="flex-1">
                      <div class="exercise-content flex flex-wrap items-center gap-2 text-lg">
                        ${parseGermanText(exercise.german, exercise.correctAnswer)}
                      </div>
                      <div class="exercise-feedback mt-2 hidden">
                        <p class="text-sm"></p>
                      </div>
                      <div class="correct-answer mt-2 hidden">
                        <span class="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
                          Đáp án: ${exercise.correctAnswer}
                        </span>
                      </div>
                    </div>
                    <button class="check-single-btn px-3 py-1 text-sm border rounded hover:bg-blue-50 dark:hover:bg-blue-950">
                      Kiểm tra
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
            
            <!-- Progress Summary -->
            <div class="progress-summary p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hidden">
              <h4 class="font-semibold mb-2">Tóm tắt kết quả:</h4>
              <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div class="text-2xl font-bold text-green-600 correct-count">0</div>
                  <div class="text-sm text-gray-600">Đúng</div>
                </div>
                <div>
                  <div class="text-2xl font-bold text-red-600 wrong-count">0</div>
                  <div class="text-sm text-gray-600">Sai</div>
                </div>
                <div>
                  <div class="text-2xl font-bold score-percentage">0%</div>
                  <div class="text-sm text-gray-600">Điểm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function parseGermanText(german: string, correctAnswer: string) {
      const parts = german.split('_____');
      if (parts.length === 2) {
        return `
          <span>${parts[0]}</span>
          <input type="text" class="exercise-input border border-gray-300 rounded px-2 py-1 mx-1 min-w-24 text-center" data-answer="${correctAnswer}" placeholder="...">
          <span>${parts[1]}</span>
        `;
      }
      return german;
    }

    function addEventListeners(container: HTMLElement, data: any) {
      const checkAllBtn = container.querySelector('.check-all-btn');
      const resetBtn = container.querySelector('.reset-btn');
      const showAnswersBtn = container.querySelector('.show-answers-btn');
      const checkSingleBtns = container.querySelectorAll('.check-single-btn');
      
      // Check all answers
      checkAllBtn?.addEventListener('click', function() {
        let correct = 0;
        const total = data.exercises.length;
        
        data.exercises.forEach((exercise: any) => {
          const exerciseItem = container.querySelector(`[data-exercise-id="${exercise.id}"]`);
          const input = exerciseItem?.querySelector('.exercise-input') as HTMLInputElement;
          if (!input) return;
          
          const userAnswer = input.value.trim().toLowerCase();
          const correctAnswer = exercise.correctAnswer.toLowerCase();
          
          input.classList.remove('correct', 'incorrect');
          exerciseItem?.classList.remove('correct', 'incorrect');
          
          if (userAnswer === correctAnswer) {
            input.classList.add('correct');
            exerciseItem?.classList.add('correct');
            correct++;
          } else {
            input.classList.add('incorrect');
            exerciseItem?.classList.add('incorrect');
            
            // Show feedback
            const feedback = exerciseItem?.querySelector('.exercise-feedback');
            const feedbackText = feedback?.querySelector('p');
            if (feedbackText) {
              feedbackText.textContent = `Đáp án đúng: ${exercise.correctAnswer}`;
              feedbackText.className = 'text-sm text-red-600';
              feedback?.classList.remove('hidden');
            }
          }
        });
        
        // Show results
        showResults(container, correct, total);
      });
      
      // Reset all
      resetBtn?.addEventListener('click', function() {
        container.querySelectorAll('.exercise-input').forEach((input: Element) => {
          (input as HTMLInputElement).value = '';
          input.classList.remove('correct', 'incorrect');
        });
        
        container.querySelectorAll('.exercise-item').forEach(item => {
          item.classList.remove('correct', 'incorrect');
        });
        
        container.querySelectorAll('.exercise-feedback').forEach(feedback => {
          feedback.classList.add('hidden');
        });
        
        container.querySelectorAll('.correct-answer').forEach(answer => {
          answer.classList.add('hidden');
        });
        
        container.querySelector('.results-badge')?.classList.add('hidden');
        container.querySelector('.progress-summary')?.classList.add('hidden');
      });
      
      // Show/hide answers
      let showingAnswers = false;
      showAnswersBtn?.addEventListener('click', function() {
        showingAnswers = !showingAnswers;
        const answerElements = container.querySelectorAll('.correct-answer');
        const buttonText = container.querySelector('.show-answers-text');
        
        answerElements.forEach(answer => {
          if (showingAnswers) {
            answer.classList.remove('hidden');
          } else {
            answer.classList.add('hidden');
          }
        });
        
        if (buttonText) {
          buttonText.textContent = showingAnswers ? 'Ẩn đáp án' : 'Hiện đáp án';
        }
      });
      
      // Check single answer
      checkSingleBtns.forEach(btn => {
        btn.addEventListener('click', function(this: HTMLButtonElement) {
          const exerciseItem = this.closest('.exercise-item');
          if (!exerciseItem) return;
          
          const exerciseId = parseInt(exerciseItem.getAttribute('data-exercise-id') || '0');
          const exercise = data.exercises.find((ex: any) => ex.id === exerciseId);
          const input = exerciseItem.querySelector('.exercise-input') as HTMLInputElement;
          if (!input || !exercise) return;
          
          const userAnswer = input.value.trim().toLowerCase();
          const correctAnswer = exercise.correctAnswer.toLowerCase();
          
          input.classList.remove('correct', 'incorrect');
          exerciseItem.classList.remove('correct', 'incorrect');
          
          const feedback = exerciseItem.querySelector('.exercise-feedback');
          const feedbackText = feedback?.querySelector('p');
          
          if (userAnswer === correctAnswer) {
            input.classList.add('correct');
            exerciseItem.classList.add('correct');
            if (feedbackText) {
              feedbackText.textContent = 'Chính xác! 👍';
              feedbackText.className = 'text-sm text-green-600';
            }
          } else {
            input.classList.add('incorrect');
            exerciseItem.classList.add('incorrect');
            if (feedbackText) {
              feedbackText.textContent = `Chưa đúng. Đáp án: ${exercise.correctAnswer}`;
              feedbackText.className = 'text-sm text-red-600';
            }
          }
          
          feedback?.classList.remove('hidden');
          this.textContent = 'Đã kiểm tra';
          this.disabled = true;
        });
      });
    }

    function showResults(container: HTMLElement, correct: number, total: number) {
      const percentage = Math.round((correct / total) * 100);
      
      // Show results badge
      const resultsBadge = container.querySelector('.results-badge');
      const badgeSpan = resultsBadge?.querySelector('span');
      if (badgeSpan) {
        badgeSpan.textContent = `Kết quả: ${correct}/${total} (${percentage}%)`;
        
        if (percentage >= 80) {
          badgeSpan.className = 'inline-block px-4 py-2 border rounded-lg font-semibold text-green-600 border-green-200 bg-green-50';
        } else if (percentage >= 60) {
          badgeSpan.className = 'inline-block px-4 py-2 border rounded-lg font-semibold text-yellow-600 border-yellow-200 bg-yellow-50';
        } else {
          badgeSpan.className = 'inline-block px-4 py-2 border rounded-lg font-semibold text-red-600 border-red-200 bg-red-50';
        }
        
        resultsBadge?.classList.remove('hidden');
      }
      
      // Show progress summary
      const summary = container.querySelector('.progress-summary');
      const correctCount = summary?.querySelector('.correct-count');
      const wrongCount = summary?.querySelector('.wrong-count');
      const scorePercentage = summary?.querySelector('.score-percentage');
      
      if (correctCount) correctCount.textContent = correct.toString();
      if (wrongCount) wrongCount.textContent = (total - correct).toString();
      if (scorePercentage) {
        scorePercentage.textContent = `${percentage}%`;
        
        if (percentage >= 80) {
          scorePercentage.className = 'text-2xl font-bold text-green-600';
        } else if (percentage >= 60) {
          scorePercentage.className = 'text-2xl font-bold text-yellow-600';
        } else {
          scorePercentage.className = 'text-2xl font-bold text-red-600';
        }
      }
      
      summary?.classList.remove('hidden');
    }

  }, [htmlContent]);

  return (
    <div 
      ref={containerRef}
      className="exercise-content prose prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1 prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground prose-h5:text-foreground prose-h6:text-foreground prose-h1:no-underline prose-h2:no-underline prose-h3:no-underline prose-h4:no-underline prose-h5:no-underline prose-h6:no-underline"
      dangerouslySetInnerHTML={{ __html: decodedHtml }}
    />
  );
}
