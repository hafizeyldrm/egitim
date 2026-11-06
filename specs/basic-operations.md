# TodoMVC temel işlemler test planı

## Application Overview

https://demo.playwright.dev/todomvc uygulamasının temel Todo işlemlerini doğrulayan manuel/otomasyon test planı. Her test yeni, boş bir uygulama durumunda başlar ve diğer testlerden bağımsız çalıştırılmalıdır. Temel kapsam: Todo ekleme ve doğrulama, tekil/toplu tamamlanma, filtreler, düzenleme, tekil silme ve tamamlananları temizleme. Başarı ölçütü, adımların beklenen sonuçları sağlamasıdır; uygulama React • TodoMVC demosudur.

## Test Scenarios

### 1. Todo oluşturma

**Başlangıç durumu:** Teste uygulama verisi temizlenmiş boş listeyle başlayın (uygulama bağlamını sıfırlayın veya localStorage'ı temizleyip `/#/` adresini açın).

#### 1.1. Geçerli başlıkla Todo ekleme

**File:** `specs/basic-operations.md`

**Steps:**
  1. Uygulamayı boş başlangıç durumunda açın ve “What needs to be done?” alanına “Buy groceries” yazın.
    - expect: Giriş alanı yazılan başlığı kabul eder.
  2. Enter tuşuna basın.
    - expect: “Buy groceries” listede bir kez görünür.
    - expect: Giriş alanı temizlenir.
    - expect: Kalan öğe sayacı 1 item left gösterir.
    - expect: Tekil tamamlama kutusu ve toplu tamamlama kontrolü görünür.

#### 1.2. Birden fazla Todo ekleme ve sayaç

**File:** `specs/basic-operations.md`

**Steps:**
  1. Boş listeye sırasıyla “Buy groceries” ve “Read a book” başlıklarını Enter ile ekleyin.
    - expect: İki başlık listede ayrı öğeler olarak görünür.
    - expect: Her iki öğe tamamlanmamış durumdadır.
    - expect: Sayaç 2 items left gösterir.
  2. Giriş alanına boş metin bırakıp Enter'a basın; ardından yalnızca boşluklardan oluşan bir başlık girip Enter'a basın.
    - expect: Boş veya boşluk-only giriş yeni Todo oluşturmaz.
    - expect: Var olan iki öğe ve sayaç değişmeden kalır.

### 2. Tamamlama durumu

**Başlangıç durumu:** Teste uygulama verisi temizlenmiş boş listeyle başlayın (uygulama bağlamını sıfırlayın veya localStorage'ı temizleyip `/#/` adresini açın).

#### 2.1. Tek bir Todo'yu tamamlama ve geri alma

**File:** `specs/basic-operations.md`

**Steps:**
  1. Boş listeye “Buy groceries” ve “Read a book” ekleyin.
    - expect: Sayaç 2 items left gösterir.
  2. “Buy groceries” öğesinin Toggle Todo kutusunu işaretleyin.
    - expect: Yalnızca “Buy groceries” tamamlandı olarak işaretlenir.
    - expect: Sayaç 1 item left gösterir.
  3. Aynı kutunun işaretini kaldırın.
    - expect: Öğe tekrar tamamlanmamış olur.
    - expect: Sayaç 2 items left gösterir.

#### 2.2. Tüm Todo'ları toplu tamamlama ve geri alma

**File:** `specs/basic-operations.md`

**Steps:**
  1. Boş listeye iki Todo ekleyin ve yalnızca birini tamamlayın.
    - expect: Liste bir tamamlanmış ve bir tamamlanmamış öğe içerir.
  2. Mark all as complete kontrolünü etkinleştirin.
    - expect: Her iki öğe tamamlanmış olur.
    - expect: Sayaç 0 items left gösterir.
  3. Aynı toplu kontrolü tekrar etkinleştirerek işaretini kaldırın.
    - expect: Her iki öğe tamamlanmamış olur.
    - expect: Sayaç 2 items left gösterir.

### 3. Filtreleme

**Başlangıç durumu:** Teste uygulama verisi temizlenmiş boş listeyle başlayın (uygulama bağlamını sıfırlayın veya localStorage'ı temizleyip `/#/` adresini açın).

#### 3.1. All, Active ve Completed filtrelerini kullanma

**File:** `specs/basic-operations.md`

**Steps:**
  1. “Buy groceries” ve “Read a book” başlıklı iki Todo ekleyin; yalnızca “Buy groceries” öğesini tamamlayın.
    - expect: Liste iki öğeyi gösterir ve sayaç 1 item left olur.
  2. Active filtresine tıklayın.
    - expect: Yalnızca tamamlanmamış “Read a book” görünür.
    - expect: Adres parçası #/active olur.
    - expect: Sayaç tüm listedeki tamamlanmamış öğe sayısını, yani 1'i, göstermeye devam eder.
  3. Completed filtresine tıklayın.
    - expect: Yalnızca tamamlanmış “Buy groceries” görünür.
    - expect: Adres parçası #/completed olur.
    - expect: Sayaç 1 item left gösterir.
  4. All filtresine tıklayın.
    - expect: Her iki Todo yeniden görünür.
    - expect: Adres parçası #/ olur.

### 4. Todo düzenleme

**Başlangıç durumu:** Teste uygulama verisi temizlenmiş boş listeyle başlayın (uygulama bağlamını sıfırlayın veya localStorage'ı temizleyip `/#/` adresini açın).

#### 4.1. Todo başlığını düzenleyip kaydetme

**File:** `specs/basic-operations.md`

**Steps:**
  1. “Read a book” başlıklı bir Todo oluşturun ve öğe metnine çift tıklayın.
    - expect: Öğe düzenleme alanı açılır ve mevcut başlık düzenlenebilir.
  2. Başlığı “Read books” olarak değiştirip Enter'a basın.
    - expect: Düzenleme alanı kapanır.
    - expect: Listede yeni başlık “Read books” görünür; eski başlık görünmez.
    - expect: Öğe sayısı ve tamamlanma durumu değişmez.

#### 4.2. Düzenlemeyi Escape ile iptal etme

**File:** `specs/basic-operations.md`

**Steps:**
  1. “Read a book” başlıklı bir Todo oluşturun, metne çift tıklayın ve başlığı “Read books” olarak değiştirin.
    - expect: Düzenleme alanında yeni metin görünür.
  2. Escape tuşuna basın.
    - expect: Düzenleme iptal edilir ve listede özgün “Read a book” başlığı kalır.
    - expect: Öğe sayısı değişmez.

### 5. Todo silme

**Başlangıç durumu:** Teste uygulama verisi temizlenmiş boş listeyle başlayın (uygulama bağlamını sıfırlayın veya localStorage'ı temizleyip `/#/` adresini açın).

#### 5.1. Tek bir Todo'yu silme

**File:** `specs/basic-operations.md`

**Steps:**
  1. “Buy groceries” ve “Read a book” başlıklı iki Todo oluşturun.
    - expect: İki Todo listede görünür.
    - expect: Sayaç 2 items left gösterir.
  2. “Buy groceries” satırının üzerine gelerek görünen Delete düğmesine tıklayın.
    - expect: “Buy groceries” listeden kaldırılır.
    - expect: “Read a book” görünmeye devam eder.
    - expect: Sayaç 1 item left gösterir.

#### 5.2. Tamamlanan Todo'ları temizleme

**File:** `specs/basic-operations.md`

**Steps:**
  1. “Buy groceries” ve “Read a book” başlıklı iki Todo oluşturun; yalnızca “Buy groceries” öğesini tamamlayın.
    - expect: Liste tamamlanmış ve tamamlanmamış birer öğe içerir.
    - expect: Clear completed düğmesi görünür.
  2. Clear completed düğmesine tıklayın.
    - expect: Tamamlanan “Buy groceries” kaldırılır.
    - expect: Tamamlanmamış “Read a book” kalır.
    - expect: Sayaç 1 item left gösterir.
    - expect: Artık tamamlanmış öğe olmadığından Clear completed düğmesi görünmez.
