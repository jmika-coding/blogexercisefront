import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from './components/App';

import { Builder, By, until } from "selenium-webdriver"

// https://github.com/testing-library/react-testing-library

describe('App', () => {

  test('Add a post', async () => {

    render(<App />);

    fireEvent.click(screen.getByRole("button", {name: "Create a post"}))
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: {value: 'my new title'},
    })
    fireEvent.change(screen.getByLabelText(/textarea-post/i), {
      target: {value: 'my new post'},
    })
    // Submit form
    fireEvent.submit(screen.getByLabelText('postForm'))

    expect(screen.getByDisplayValue("my new title")).toBeInTheDocument();
    expect(screen.getByDisplayValue("my new post")).toBeInTheDocument();
  })

  // Use Selenium driver, because otherwise can't see posts in JEST-DOM
  // I don't know why, maybe because it is not a real DOM, but virtual DOM, maybe even a simulation of DOM ?
  // So with Selenium we use a real browser to test, so real DOM
  // With screen.debug(), can't see posts, but <div /> instead
  test("Show info of a post and delete a post", async () => {
    const driver = await new Builder().forBrowser('chrome').build();

    try {
      // Load page
      await driver.get("http://localhost:3001")

      // Get all posts
      const elements = await driver.findElements(By.className("post"));

      // Show info of post and comment form
      const element = elements[elements.length-1];
      await element.click();
      const commentsFound = await element.findElement(By.className("commentTitle"))
      expect(await commentsFound.getText()).toBe("Comments:");

      // Delete a post, the last one that was created by the first test above
      const deleteButton = await driver.findElement(By.xpath("//button[text()='Delete a Post']"));
      await deleteButton.click();
      await elements[elements.length-1].click();
      await driver.wait(until.alertIsPresent()); // Wait for the alert to be displayed`
      await driver.switchTo().alert().accept();
    }
    finally {
      // Sleep a little to let the program finishes it's execution before quitting
      // If not, last instruction not fully executed
      await driver.sleep(500);
      await driver.quit();
    }
  })
});
