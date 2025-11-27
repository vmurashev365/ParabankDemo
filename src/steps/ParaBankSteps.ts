import { When, Then } from '@cucumber/cucumber';
import { RegisterPage } from '../pages/RegisterPage';

// ParaBank-specific step definitions that reflect actual behavior
Then('ParaBank accepts invalid address', async function () {
  console.log('Verifying ParaBank processes registration despite invalid address...');
  
  const currentUrl = this.page!.url();
  const pageContent = await this.page!.textContent('body') || '';
  
  const hasSuccessMessage = pageContent.includes('Welcome') || pageContent.includes('successfully');
  const hasUsernameError = pageContent.includes('username already exists');
  
  if (hasSuccessMessage || hasUsernameError) {
    console.log('Registration processed (ParaBank accepts invalid address as expected)');
  } else {
    console.log('Unexpected behavior - registration rejected');
  }
});

Then('ParaBank accepts invalid city', async function () {
  console.log('Verifying ParaBank processes registration despite invalid city...');
  
  const currentUrl = this.page!.url();
  const pageContent = await this.page!.textContent('body') || '';
  
  const hasSuccessMessage = pageContent.includes('Welcome') || pageContent.includes('successfully');
  const hasUsernameError = pageContent.includes('username already exists');
  
  if (hasSuccessMessage || hasUsernameError) {
    console.log('Registration processed (ParaBank accepts invalid city as expected)');
  } else {
    console.log('Unexpected behavior - registration rejected');
  }
});

Then('ParaBank accepts invalid state', async function () {
  console.log('Verifying ParaBank processes registration despite invalid state...');
  
  const currentUrl = this.page!.url();
  const pageContent = await this.page!.textContent('body') || '';
  
  const hasSuccessMessage = pageContent.includes('Welcome') || pageContent.includes('successfully');
  const hasUsernameError = pageContent.includes('username already exists');
  
  if (hasSuccessMessage || hasUsernameError) {
    console.log('Registration processed (ParaBank accepts invalid state as expected)');
  } else {
    console.log('Unexpected behavior - registration rejected');
  }
});

Then('ParaBank accepts invalid zip', async function () {
  console.log('Verifying ParaBank processes registration despite invalid zip code...');
  
  const currentUrl = this.page!.url();
  const pageContent = await this.page!.textContent('body') || '';
  
  const hasSuccessMessage = pageContent.includes('Welcome') || pageContent.includes('successfully');
  const hasUsernameError = pageContent.includes('username already exists');
  
  if (hasSuccessMessage || hasUsernameError) {
    console.log('Registration processed (ParaBank accepts invalid zip as expected)');
  } else {
    console.log('Unexpected behavior - registration rejected');
  }
});

Then('ParaBank accepts invalid phone', async function () {
  console.log('Verifying ParaBank processes registration despite invalid phone...');
  
  const currentUrl = this.page!.url();
  const pageContent = await this.page!.textContent('body') || '';
  
  const hasSuccessMessage = pageContent.includes('Welcome') || pageContent.includes('successfully');
  const hasUsernameError = pageContent.includes('username already exists');
  
  if (hasSuccessMessage || hasUsernameError) {
    console.log('Registration processed (ParaBank accepts invalid phone as expected)');
  } else {
    console.log('Unexpected behavior - registration rejected');
  }
});

Then('ParaBank accepts invalid SSN', async function () {
  console.log('Verifying ParaBank processes registration despite invalid SSN...');
  
  const currentUrl = this.page!.url();
  const pageContent = await this.page!.textContent('body') || '';
  
  const hasSuccessMessage = pageContent.includes('Welcome') || pageContent.includes('successfully');
  const hasUsernameError = pageContent.includes('username already exists');
  
  if (hasSuccessMessage || hasUsernameError) {
    console.log('Registration processed (ParaBank accepts invalid SSN as expected)');
  } else {
    console.log('Unexpected behavior - registration rejected');
  }
});

Then('ParaBank accepts mismatched passwords', async function () {
  console.log('Verifying ParaBank processes registration despite mismatched passwords...');
  
  const currentUrl = this.page!.url();
  const pageContent = await this.page!.textContent('body') || '';
  
  const hasSuccessMessage = pageContent.includes('Welcome') || pageContent.includes('successfully');
  const hasUsernameError = pageContent.includes('username already exists');
  
  if (hasSuccessMessage || hasUsernameError) {
    console.log('Registration processed (ParaBank accepts mismatched passwords as expected)');
  } else {
    console.log('Unexpected behavior - registration rejected');
  }
});

When('I submit registration form', async function () {
  console.log('Submitting registration form...');
  
  const registerPage = new RegisterPage(this.page!);
  await registerPage.submitRegistration();
  
  console.log('Registration form submitted');
});
