package com.example.demo.controller;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*") 
public class AnalyticsController {

    @Autowired
    private ExpenseRepository repo;

    @Autowired
    private UserRepository userRepo;

    // ✅ TOTAL EXPENSE
    @GetMapping("/total/{userId}")
    public double total(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow();

        return repo.findByUser(user)
                .stream()
                .mapToDouble(Expense::getAmount)
                .sum();
    }

    // ✅ CATEGORY-WISE
    @GetMapping("/category/{userId}")
    public Map<String, Double> category(@PathVariable Long userId) {

        User user = userRepo.findById(userId).orElseThrow();

        Map<String, Double> map = new HashMap<>();

        for (Expense e : repo.findByUser(user)) {
            map.put(e.getCategory(),
                    map.getOrDefault(e.getCategory(), 0.0) + e.getAmount());
        }

        return map;
    }
}