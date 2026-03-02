import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Guestbook } from "../target/types/guestbook";
import { expect } from "chai";

describe("guestbook", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Guestbook as Program<Guestbook>;
  const author = provider.wallet.publicKey;

  // Derive PDA for entry
  const [entryPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("entry"), author.toBuffer()],
    program.programId
  );

  it("Creates a guestbook entry", async () => {
    const message = "Hello, Solana! This is my first guestbook entry.";

    const tx = await program.methods
      .createEntry(message)
      .accounts({
        entry: entryPda,
        author: author,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Create entry transaction:", tx);

    // Fetch the entry
    const entry = await program.account.guestbookEntry.fetch(entryPda);

    expect(entry.author.toString()).to.equal(author.toString());
    expect(entry.message).to.equal(message);
    expect(entry.timestamp.toNumber()).to.be.greaterThan(0);
  });

  it("Updates a guestbook entry", async () => {
    const newMessage = "Updated message: Learning Solana is awesome!";

    const tx = await program.methods
      .updateEntry(newMessage)
      .accounts({
        entry: entryPda,
        author: author,
      })
      .rpc();

    console.log("Update entry transaction:", tx);

    // Fetch the updated entry
    const entry = await program.account.guestbookEntry.fetch(entryPda);

    expect(entry.message).to.equal(newMessage);
  });

  it("Fails to create entry with message too long", async () => {
    const longMessage = "a".repeat(281); // 281 characters

    try {
      await program.methods
        .createEntry(longMessage)
        .accounts({
          entry: entryPda,
          author: author,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error.message).to.include("MessageTooLong");
    }
  });

  it("Fails to create entry with empty message", async () => {
    try {
      await program.methods
        .createEntry("")
        .accounts({
          entry: entryPda,
          author: author,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      expect.fail("Should have thrown an error");
    } catch (error) {
      expect(error.message).to.include("MessageEmpty");
    }
  });

  it("Deletes a guestbook entry", async () => {
    const tx = await program.methods
      .deleteEntry()
      .accounts({
        entry: entryPda,
        author: author,
      })
      .rpc();

    console.log("Delete entry transaction:", tx);

    // Try to fetch the deleted entry (should fail)
    try {
      await program.account.guestbookEntry.fetch(entryPda);
      expect.fail("Entry should be deleted");
    } catch (error) {
      expect(error.message).to.include("Account does not exist");
    }
  });
});
