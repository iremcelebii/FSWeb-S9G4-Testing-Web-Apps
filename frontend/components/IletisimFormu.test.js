import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import IletisimFormu from "./IletisimFormu";

test("hata olmadan render ediliyor", () => {
  render(<IletisimFormu />);
});

test("iletişim formu headerı render ediliyor", () => {
  render(<IletisimFormu />);
  //! h1 test id si olan bir şey render ediliyor mu?
  expect(screen.getByTestId("h1")).toBeInTheDocument();

  //! h1 test id si olan şeyde İletişim Formu yazıyor mu?
  //!en iyisi elemana data-testid verip onunla seçmek
  expect(screen.getByTestId("h1").textContent).toBe("İletişim Formu");

  //! bir değere atayarak da yazabilirsin
  const baslik = screen.getByTestId("h1");
  expect(baslik.textContent).toBe("İletişim Formu");

  //! html etiketi ile de elemanı bulabiliriz
  const baslik3 = screen.getByRole("heading", { level: 1 });
  expect(baslik3.textContent).toBe("İletişim Formu");

  //!etütte şöyle yapmışlar
  const baslik2 = screen.getByText("İletişim Formu");
  expect(baslik2).toBeInTheDocument();
});

test("kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  //   render(<IletisimFormu />);

  //   const inputIsim = screen.getByTestId("ad");
  //   //!userevent.type ile input alanına bir şey yazdırıyorum
  //   userEvent.type(inputIsim, "irem");
  //   //!erroru asenkron kullanmayacaksam önce iputu yazdırıp sonra erroru tanımlamalıyım
  //   const errorAd = screen.getByTestId("error");
  //   expect(errorAd).toBeVisible();

  //   !asenkron da yapabilirim o zaman inputa yazdırmadan önce error tanımlasam da sıkıntı çıkarmayacak
  render(<IletisimFormu />);
  const errorAd = screen.findByTestId("error");
  const inputIsim = screen.getByTestId("ad");
  userEvent.type(inputIsim, "irem");
  expect(await errorAd).toBeVisible();

  //!neden awaiti burada kullanıyoruz çünkü bulmasını beklemiyoruz aslında görünür olmasını beklememiz gerekiyor
});

test("kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const buton = screen.getByRole("button");
  userEvent.click(buton);
  expect(await screen.findAllByTestId("error")).toHaveLength(3);
});

test("kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  render(<IletisimFormu />);
  const inputIsim = screen.getByTestId("ad");
  userEvent.type(inputIsim, "iremm");
  const inputSoyisim = screen.getByPlaceholderText("Mansız");
  userEvent.type(inputSoyisim, "Çelebi");
  const buton = screen.getByRole("button");
  userEvent.click(buton);
  expect(await screen.findAllByTestId("error")).toHaveLength(1);
});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const inputEmail = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  userEvent.type(inputEmail, "iremgmail.com");
  expect(inputEmail).toHaveValue("iremgmail.com");

  const errorAd = screen.getByTestId("error");
  expect(errorAd).toBeVisible();
});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', async () => {
  render(<IletisimFormu />);
  const inputIsim = screen.getByTestId("ad");
  userEvent.type(inputIsim, "iremm");
  const inputEmail = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  userEvent.type(inputEmail, "irem@gmail.com");
  const buton = screen.getByRole("button");
  userEvent.click(buton);
  const errorSoyad = screen.getByTestId("error");
  expect(errorSoyad).toBeVisible();
  expect(errorSoyad).toHaveTextContent("Hata: soyad gereklidir.");
});

test("ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  render(<IletisimFormu />);
  const inputIsim = screen.getByTestId("ad");
  userEvent.type(inputIsim, "iremm");

  const inputSoyad = screen.getByPlaceholderText("Mansız");
  userEvent.type(inputSoyad, "Çelebi");

  const inputEmail = screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com");
  userEvent.type(inputEmail, "irem@gmail.com");

  const buton = screen.getByRole("button");
  userEvent.click(buton);
  const error = screen.queryAllByTestId("error");

  //!ikisi de olur
  //expect(error).toHaveLength(0);
  expect(error.length).toBe(0);
});

test("form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {
  render(<IletisimFormu />);

  userEvent.type(screen.getByTestId("ad"), "iremm");
  userEvent.type(screen.getByPlaceholderText("Mansız"), "çelebi");
  userEvent.type(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    "irem@gmail.com"
  );
  userEvent.type(screen.getByTestId("mesaj"), "mesaj yazıyorum");
  //! aşağıdaki gibi yazarsam hata veriyor
  //   expect(screen.getByTestId("ad")).toHaveTextContent("iremm");
  expect(await screen.findByTestId("ad")).toHaveValue("iremm");
  expect(screen.getByPlaceholderText("Mansız")).toHaveValue("çelebi");
  expect(
    screen.getByPlaceholderText("yüzyılıngolcüsü@hotmail.com")
  ).toHaveValue("irem@gmail.com");
  expect(screen.getByTestId("mesaj")).toHaveValue("mesaj yazıyorum");
});
