---

# Cartesi Quiz App

This Javascript program is an implementation of a quiz game, integrated with cartesi rollup.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)
- [Quiz Logic](#quiz-logic)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This program demonstrates a basic implementation of a quiz game that can only be played by two users. Users interacts with the cartesi rollup to handle game states, using the given rollup mechanism.

## Features

- A user can answer a question by sending a generic input.
- A user cannot answer the same question twice.
- A user cannot play himself/herself(Same msg_sender is not allowed).
- A winner is decided after the third round.

## Requirements

- Install the required dependencies:

   ```bash
   npm i -g @cartesi/cli
   ```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Joshaw-k/Cartesi_task_1.git
   ```



## Usage

1. build a Cartesi machine and run a local node for the application:

   ```bash
   cartesi build
   cartesi run
   ```

2. Sending inputs:
     ```bash
   cartesi send generic
   ```

   

## Quiz Logic

The game follows these basic rules:

- First response from the user should be name
- The next responses should be the answer to question for the following round
- A user with the highest points wins


## Contributing

Contributions are welcome! If you want to contribute to this project, feel free to fork the repository and submit a pull request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---
