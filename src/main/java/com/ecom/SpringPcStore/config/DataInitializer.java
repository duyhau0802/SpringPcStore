// package com.ecom.SpringPcStore.config;

// import com.ecom.SpringPcStore.entity.Role;
// import com.ecom.SpringPcStore.repository.RoleRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;

// @Component
// @RequiredArgsConstructor
// public class DataInitializer implements CommandLineRunner {

//     private final RoleRepository roleRepository;

//     @Override
//     public void run(String... args) throws Exception {
//         if (!roleRepository.findByName("USER").isPresent()) {
//             Role userRole = new Role();
//             userRole.setName("USER");
//             roleRepository.save(userRole);
//         }

//         if (!roleRepository.findByName("ADMIN").isPresent()) {
//             Role adminRole = new Role();
//             adminRole.setName("ADMIN");
//             roleRepository.save(adminRole);
//         }
//     }
// }
