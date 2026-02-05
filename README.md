  
# Video Games Management RESTful API 🎮

Μια ολοκληρωμένη λύση Backend για τη διαχείριση και παροχή δεδομένων βιντεοπαιχνιδιών. Το API είναι σχεδιασμένο με την αρχιτεκτονική **MVC (Model-View-Controller)**, προσφέροντας ασφάλεια, επεκτασιμότητα και προηγμένες δυνατότητες αναζήτησης.

## 🛠️ Τεχνολογίες
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas (Cloud NoSQL)
* **ODM:** Mongoose
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
* **Logging:** Morgan

## 📂 Αρχιτεκτονική MVC
Ο κώδικας είναι οργανωμένος σε διακριτά επίπεδα για καθαρότητα και εύκολη συντήρηση:
* **Models:** Ορισμός Schemas για την ακεραιότητα των δεδομένων (VideoGames, Users).
* **Controllers:** Επιχειρησιακή λογική, διαχείριση σφαλμάτων και Aggregations.
* **Routes:** Καθορισμός των API Endpoints και διαχωρισμός Δημόσιας/Προστατευμένης πρόσβασης.

## 🚀 Χαρακτηριστικά
* **Πλήρες CRUD:** Δημιουργία, ανάγνωση, ενημέρωση και διαγραφή παιχνιδιών.
* **Advanced Search:** Δυναμικά φίλτρα (title regex, price range, release year, consoles, tags).
* **Aggregations:** Στατιστικά δεδομένα (π.χ. Top 5 games, ομαδοποίηση ανά κατηγορία).
* **Security:** Προστασία κρίσιμων routes με JWT Authorization middleware.
* **Data Seeding:** Script αυτόματης αρχικοποίησης της βάσης από JSON αρχείο.

## 🔧 Εγκατάσταση

1. **Κλωνοποίηση του Repo:**
   ```bash
   git clone https://github.com/orasimos/AegeanCollege_AdvancedProgramming_VideoGames.git
2. **Εγκατάσταση Dependencies:**
    ```bash 
    npm install
3. **Ρύθμιση .env:**
    Τοποθετήστε το αρχείο .env στο root folder

4. **Έναρξη και Αρχικοποίηση της Βάσης:**
	-	*Για την έναρξη της εφαρμογής τρέξτε:*
		 ```bash
		 node app.js
	- *Σε περίπτωση που θέλετε να αρχικοποιήσετε ή να κάνετε reset της βάσης δεδομένων:*
		```bash
		node app.js --initialize
## 🔌 API Endpoints (Συνοπτικά)

### 1. Video Games Resource (`/api/videogames`)

#### Δημόσια Endpoints (Public)
| Method | Endpoint | Περιγραφή |
| :--- | :--- | :--- |
| **GET** | `/all-videogames` | Ανάκτηση της πλήρους λίστας των βιντεοπαιχνιδιών |
| **GET** | `/top-5-rated` | Επιστροφή των 5 παιχνιδιών με την υψηλότερη βαθμολογία |
| **GET** | `/by-type` | Ομαδοποίηση παιχνιδιών ανά τύπο με χρήση Aggregation |
| **GET** | `/search` | Δυναμική αναζήτηση με πολλαπλά φίλτρα (title, price, rating κ.α.) |
| **GET** | `/:id` | Ανάκτηση λεπτομερειών ενός συγκεκριμένου παιχνιδιού βάσει ID |

#### Προστατευμένα Endpoints (Protected - Απαιτείται JWT)
- Για την επιτυχή ολοκλήρωση των requests θα πρέπει να προστεθεί στα headers το token που επιστρέφεται από τις ***signup()*** και ***login()*** :
	```bash
	Authentication: Bearer <token>
| Method | Endpoint | Περιγραφή |
| :--- | :--- | :--- |
| **POST** | `/` | Εισαγωγή νέου βιντεοπαιχνιδιού στη βάση δεδομένων |
| **PATCH** | `/:id` | Μερική ενημέρωση στοιχείων υφιστάμενου παιχνιδιού |
| **DELETE** | `/:id` | Οριστική διαγραφή παιχνιδιού από τη βάση |

---

### 2. Authentication Resource (`/api/auth`)

| Method | Endpoint | Περιγραφή |
| :--- | :--- | :--- |
| **POST** | `/signup` | Εγγραφή νέου χρήστη και έκδοση JWT token |
| **POST** | `/login` | Ταυτοποίηση χρήστη και επιστροφή token πρόσβασης. |

---

## 3. Miscellaneous Resource (`/api/misc`)

Βοηθητικά endpoints που επιστρέφουν μοναδικές τιμές για τη διευκόλυνση του Client:

| Method | Endpoint | Περιγραφή |
| :--- | :--- | :--- |
| **GET** | `/companies` | Ανάκτηση λίστας με όλες τις διαθέσιμες εταιρείες (distinct) |
| **GET** | `/types` | Ανάκτηση όλων των μοναδικών τύπων παιχνιδιών |
| **GET** | `/consoles` | Ανάκτηση όλων των διαθέσιμων πλατφορμών/κονσολών |
