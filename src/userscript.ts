(function() {
    'use strict';

    class ColorShortcuts {
        private lastKeyPress: string = '';
        private lastKeyTime: number = 0;
        private doublePressTimeout: number = 500; // milliseconds
        private waitingForNumber: boolean = false;
        private numberTimeout: number | null = null;
        private collectedNumbers: string = '';
        private numberCollectionTimeout: number = 500; // milliseconds to collect numbers

        constructor() {
            this.init();
        }

        private init(): void {
            console.log('Color Shortcuts initialized - Double-tap C followed by a number');
            this.bindEvents();
        }

        private bindEvents(): void {
            document.addEventListener('keydown', (event: KeyboardEvent) => {
                // Ignore if modifier keys are pressed
                if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
                    return;
                }

                this.handleKeyPress(event);
            });
        }

        private handleKeyPress(event: KeyboardEvent): void {
            const key = event.key.toLowerCase();
            const currentTime = Date.now();

            // Handle double-C detection
            if (key === 'c') {
                if (this.lastKeyPress === 'c' && 
                    (currentTime - this.lastKeyTime) < this.doublePressTimeout) {
                    // Double-C detected!
                    event.preventDefault();
                    this.startNumberWait();
                    this.lastKeyPress = '';
                    return;
                }
                this.lastKeyPress = 'c';
                this.lastKeyTime = currentTime;
                return;
            }

            // Handle number input after double-C
            if (this.waitingForNumber && this.isNumberKey(key)) {
                event.preventDefault();
                this.addNumberToCollection(key);
                return;
            }

            // Reset if any other key is pressed
            if (key !== 'c') {
                this.resetState();
            }
        }

        private startNumberWait(): void {
            this.waitingForNumber = true;
            this.collectedNumbers = '';
            console.log('Double-C detected! Press number(s) (0-9) to click color element');
            
            // Clear any existing timeout
            if (this.numberTimeout) {
                clearTimeout(this.numberTimeout);
            }

            // Set timeout to reset state if no number is pressed
            this.numberTimeout = setTimeout(() => {
                console.log('Number timeout - resetting');
                this.resetState();
            }, 3000) as unknown as number;
        }

        private isNumberKey(key: string): boolean {
            return /^[0-9]$/.test(key);
        }

        private addNumberToCollection(number: string): void {
            this.collectedNumbers += number;
            console.log(`Collected: ${this.collectedNumbers}`);
            
            // Show visual feedback of current number
            this.showFeedback(`Number: ${this.collectedNumbers}`, 'info');
            
            // Clear existing timeout and set a new one for number collection
            if (this.numberTimeout) {
                clearTimeout(this.numberTimeout);
            }
            
            // Wait for potential second digit, then execute
            this.numberTimeout = setTimeout(() => {
                this.clickColorElement(this.collectedNumbers);
                this.resetState();
            }, this.numberCollectionTimeout) as unknown as number;
        }

        private clickColorElement(number: string): void {
            const elementId = `color-${number}`;
            const element = document.getElementById(elementId) as HTMLElement;
            
            if (element) {
                console.log(`Clicking element: ${elementId}`);
                element.click();
                
                // Visual feedback
                this.showFeedback(`Clicked ${elementId}`, 'success');
            } else {
                console.log(`Element not found: ${elementId}`);
                this.showFeedback(`Element ${elementId} not found`, 'error');
            }
        }

        private showFeedback(message: string, type: 'success' | 'error' | 'info'): void {
            // Create a temporary notification
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 10px 15px;
                border-radius: 5px;
                color: white;
                font-family: Arial, sans-serif;
                font-size: 14px;
                z-index: 10000;
                transition: opacity 0.3s ease;
                background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            `;

            document.body.appendChild(notification);

            // Remove after 2 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 2000);
        }

        private resetState(): void {
            this.waitingForNumber = false;
            this.lastKeyPress = '';
            this.collectedNumbers = '';
            
            if (this.numberTimeout) {
                clearTimeout(this.numberTimeout);
                this.numberTimeout = null;
            }
        }
    }

    // Initialize the userscript when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new ColorShortcuts();
        });
    } else {
        new ColorShortcuts();
    }

})();
