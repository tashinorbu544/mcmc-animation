# MCMC Rooms Animation (1D)

This project is an interactive, web-based visualization of a **Metropolis–Hastings Markov Chain Monte Carlo (MCMC)** process.

A single person moves between a set of rooms arranged in a line.  
Each room has a different size, representing the **target probability distribution**.  
Over time, the person visits rooms according to their probability mass.

The visualization is designed for **teaching, presentations, and intuitive explanation** of MCMC concepts.

---

## 🌐 Live Demo

👉 **View the interactive animation here:**  
(https://tashinorbu544.github.io/mcmc-animation/)



---

## 🧠 Conceptual Explanation

- **Room height** = target probability  
- **Red dot** = current state of the Markov chain  
- **Movement rule** = Metropolis–Hastings acceptance ratio  
- **Wiggle plot** = MCMC trajectory over time (mixing & sticking)  
- **Bar plot** = empirical stationary distribution (result)

Larger rooms correspond to higher probabilities, and the chain naturally spends more time in them.

---

## 🖼 Visualization Layout

**Top panel**
- Room sizes (target distribution)
- Current position of the person (red dot)

**Bottom-left**
- Wiggle / trace plot of the MCMC trajectory over time

**Bottom-right**
- Bar chart showing visit frequency per room

---

## ⚙️ How It Works

The MCMC algorithm follows this logic:

1. Start in an initial room
2. Propose a move to a neighboring room
3. Accept or reject based on the probability ratio
4. Repeat for a fixed number of steps

Room probabilities are defined as:

```js
rooms = [0.05, 0.15, 0.4, 0.1, 0.15]
