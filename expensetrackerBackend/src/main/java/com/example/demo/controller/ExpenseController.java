package com.example.demo.controller;

import com.example.demo.entity.Expense;
import com.example.demo.entity.User;
import com.example.demo.repository.ExpenseRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:5173") // ✅ VERY IMPORTANT
public class ExpenseController {

    @Autowired
    private ExpenseRepository expenseRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    // 🔐 GET USER FROM TOKEN
    private User getUserFromToken(String header) {
        if (header == null || !header.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization token missing");
        }

        String token = header.substring(7);
        String email = jwtUtil.extractUsername(token);

        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
    }

    // ✅ CREATE
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense,
                             @RequestHeader("Authorization") String header) {

        User user = getUserFromToken(header);
        expense.setUser(user);

        return expenseRepo.save(expense);
    }

    // ✅ READ ALL
    @GetMapping
    public List<Expense> getExpenses(@RequestHeader("Authorization") String header) {

        User user = getUserFromToken(header);
        return expenseRepo.findByUser(user);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public Expense updateExpense(@PathVariable Long id,
                                @RequestBody Expense newExpense,
                                @RequestHeader("Authorization") String header) {

        User user = getUserFromToken(header);

        Expense existing = expenseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        existing.setAmount(newExpense.getAmount());
        existing.setCategory(newExpense.getCategory());
        existing.setDescription(newExpense.getDescription());
        existing.setDate(newExpense.getDate());

        return expenseRepo.save(existing);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public String deleteExpense(@PathVariable Long id,
                               @RequestHeader("Authorization") String header) {

        User user = getUserFromToken(header);

        Expense existing = expenseRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!existing.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        expenseRepo.delete(existing);
        return "Deleted successfully";
    }

    // 🔥 FILTER BY CATEGORY
    @GetMapping("/category")
    public List<Expense> getByCategory(@RequestParam String category,
                                       @RequestHeader("Authorization") String header) {

        User user = getUserFromToken(header);
        return expenseRepo.findByUserAndCategoryIgnoreCase(user, category);
    }

    // 🔥 FILTER BY DATE (IMPORTANT FORMAT FIX)
    @GetMapping("/date")
    public List<Expense> getByDate(@RequestParam String date,
                                   @RequestHeader("Authorization") String header) {

        User user = getUserFromToken(header);

        // expected format: yyyy-MM-dd
        LocalDate parsedDate = LocalDate.parse(date);

        return expenseRepo.findByUserAndDate(user, parsedDate);
    }

    // 🔥 TOTAL
    @GetMapping("/total")
    public Double getTotal(@RequestHeader("Authorization") String header) {

        User user = getUserFromToken(header);
        return expenseRepo.getTotalExpense(user);
    }

    // 🔥 ANALYTICS
    @GetMapping("/analytics")
    public List<Object[]> getAnalytics(@RequestHeader("Authorization") String header) {

        User user = getUserFromToken(header);
        return expenseRepo.getCategoryWise(user);
    }
}